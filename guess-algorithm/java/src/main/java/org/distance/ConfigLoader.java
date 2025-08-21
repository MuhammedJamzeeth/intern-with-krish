package org.distance;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class ConfigLoader {
    public static String getTargetValue() throws IOException {
        Properties props = new Properties();
        try (FileInputStream input = new FileInputStream("src/main/resources/config.properties")) {
            props.load(input);
        }
        return props.getProperty("targetValue");
    }
}
