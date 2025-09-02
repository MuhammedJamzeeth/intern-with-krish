package org.distance;

public class Employee {
    private final String name;

    public Employee() {
        this.name = "Default Name";
    }

    public Employee(String name) {
        this.name = name;
    }

    public void displayName() {
        System.out.println("Employee Name: " + name);

        // Print the class loader information
        ClassLoader classLoader = this.getClass().getClassLoader();
        System.out.println("Class Loader: " + classLoader);
    }
}
