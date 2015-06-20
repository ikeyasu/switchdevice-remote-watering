#include <ESP8266WiFi.h>
#include <ArduinoJson.h>

// #define SERIAL_DEBUG_PRINT
#ifdef SERIAL_DEBUG_PRINT
#define DP(x) Serial.print(x)
#define DPLN(x) Serial.println(x)
#else
#define DP(x) ((void)0)
#define DPLN(x) ((void)0)
#endif

const char* WIFI_SSID     = "megascale";
const char* WIFI_PASSWORD = "dependability";

// const char* HOST = "example.com";
// const char* PATH = "/api/things/watering/user/XXXXXXX/voltage/";
#include "localSetting.h"

const int HTTP_PORT = 80;
const int SLEEP_DURATION_MICRO_SEC = 15 * 60 * 1000 * 1000;

boolean isHTTP200(String line) {
  if (!line.startsWith("HTTP")) return false;
  int i = line.indexOf(' ');
  if (i < 0) return false;
  if (line.substring(i + 1).startsWith("200 ")) return true;
  return false;
}

void setup() {
#ifdef SERIAL_DEBUG_PRINT
  Serial.begin(115200);
#endif
  delay(10);
  pinMode(4, OUTPUT);


  // We start by connecting to a WiFi network

  DP("Connecting to ");
  DPLN(WIFI_SSID);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    DP(".");
  }

  DPLN("");
  DPLN("WiFi connected");
  DPLN("IP address: ");
  DPLN(WiFi.localIP());
}

void loop() {
  delay(1000);

  DP("connecting to ");
  DPLN(HOST);
  // Use WiFiClient class to create TCP connections
  WiFiClient client;
  if (!client.connect(HOST, HTTP_PORT)) {
    DPLN("connection failed");
    return;
  }
  int voltage = analogRead(A0);
  // We now create a URI for the request
  DP("Requesting URL: ");
  DP(HOST);
  DPLN(PATH + voltage);
  // This will send the request to the server
  client.print(String("GET ") + PATH + voltage + " HTTP/1.1\r\n" +
               "Host: " + HOST + "\r\n" +
               "Connection: close\r\n\r\n");
  delay(1000);

  // Read all the lines of the reply from server and print them to Serial
  boolean body = false;
  boolean firstLine = true;
  int msecForWatering = 0;
  while(client.available()){
    String line = client.readStringUntil('\r');
    DP(line);
    if (firstLine) {
      if (!isHTTP200(line)) {
        client.stop();
        break;
      }
      firstLine = false;
    } else if (body) {
      StaticJsonBuffer<200> jsonBuffer;
      JsonObject& root = jsonBuffer.parseObject(line);
      const char* value = root["value"];
      if (strlen(value) > 0) {
        msecForWatering = atoi(value);
      }
    } else if (line.length() == 1) {
      body = true;
      DPLN(msecForWatering);
    }
  }
  if (msecForWatering > 0) {
    digitalWrite(4, HIGH);
    delay(msecForWatering);
    digitalWrite(4, LOW);
  }
  DPLN();
  DPLN("closing connection");
  ESP.deepSleep(SLEEP_DURATION_MICRO_SEC, WAKE_NO_RFCAL);
}

