package org.distance;

public class Application {
    public static void main(String[] args) {

        Employee employee = new Employee("Jamsy");
        employee.displayName();

        // Print the class loader information for the Application class
        ClassLoader classLoader = Application.class.getClassLoader();
        System.out.println("Application Class Loader: " + classLoader);

        // Print the class loader information for the String class
        ClassLoader stringClassLoader = String.class.getClassLoader();
        System.out.println("String Class Loader: " + stringClassLoader);
    }
}