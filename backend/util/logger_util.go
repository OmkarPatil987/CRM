package util

import (
    "github.com/sirupsen/logrus"
    "os"
    "path"
    "time"
)

var currentLogDate string

func InitializeLogger() {
    logDir := "./log"
    currentLogDate = time.Now().Format("2006-01-02")
    logFileName := currentLogDate + ".log"

    if err := os.MkdirAll(logDir, os.ModePerm); err != nil {
        logrus.Error("Failed to create log dir: ", err)
        return
    }

    file, err := os.OpenFile(path.Join(logDir, logFileName), os.O_WRONLY|os.O_APPEND|os.O_CREATE, 0644)
    if err != nil {
        logrus.Error("Failed to open log file: ", err)
        return
    }

    logrus.SetOutput(file)
    logrus.SetFormatter(&logrus.JSONFormatter{TimestampFormat: "2006-01-02 15:04:05"})
    logrus.SetLevel(logrus.DebugLevel)
}
