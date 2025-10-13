package org.distance;
import org.yaml.snakeyaml.Yaml;

import java.io.InputStream;
import java.util.*;

class Ticket {
    public String id;
    public List<String> services;
}

public class Main {
    public static void main(String[] args) {
        Yaml yaml = new Yaml();

        // Load the YAML file
        InputStream inputStream = Main.class
                .getClassLoader()
                .getResourceAsStream("tickets.yml");

        Map<String, Object> data = yaml.load(inputStream);
        List<Map<String, Object>> ticketList = (List<Map<String, Object>>) data.get("tickets");

        // Build data structures
        Map<String, List<String>> ticketToServices = new HashMap<>();
        Map<String, List<String>> serviceToTickets = new HashMap<>();

        for (Map<String, Object> t : ticketList) {
            String id = (String) t.get("id");
            List<String> services = (List<String>) t.get("services");
            ticketToServices.put(id, services);

            for (String s : services) {
                serviceToTickets.computeIfAbsent(s, k -> new ArrayList<>()).add(id);
            }
        }

        // Example: Ticket B fails
        String failedTicket = "B";
        System.out.println("❌ Ticket " + failedTicket + " failed!");

        // Find affected services
        List<String> failedServices = ticketToServices.get(failedTicket);
        System.out.println("⚙️  Services impacted: " + failedServices);

        // Find other tickets that depend on those services
        HashSet<Object> impactedTickets = new HashSet<>();
        for (String service : failedServices) {
            impactedTickets.addAll(serviceToTickets.get(service));
        }

        impactedTickets.remove(failedTicket); // remove itself
        System.out.println("📋 Other tickets potentially affected: " + impactedTickets);
    }
}