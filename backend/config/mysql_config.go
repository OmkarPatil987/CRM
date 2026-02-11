package config

import "os"

// MySQLDatabaseConfig represents the MySQL database configuration.
type MySQLDatabaseConfig struct {
    Username string
    Password string
    Host     string
    Port     string
    Database string
}

func GetPrimaryMySQLDBConfig() MySQLDatabaseConfig {
    return MySQLDatabaseConfig{
        Username: getEnv("DB_USERNAME", "root"),
        Password: getEnv("DB_PASSWORD", ""),
        Host:     getEnv("DB_HOST", "127.0.0.1"),
        Port:     getEnv("DB_PORT", "3306"),
        Database: getEnv("DB_NAME", "crm"),
    }
}

func getEnv(key, defaultValue string) string {
    if v := os.Getenv(key); v != "" {
        return v
    }
    return defaultValue
}
