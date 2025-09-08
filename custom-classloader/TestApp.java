// default class loader load classed from default path (root path of project) but
// usig custom class loader we can load class from any path ex: database

import java.util.Scanner;

public class TestApp {
    public static void main(String[] args) throws Exception {
        Application application = new Application();

        System.out.println("Application Name: " + application.getName());
        String classDir = "J:/Fortude/intern-krish/custom-classloader";

        Scanner scanner = new Scanner(System.in);

        CustomClassLoader classLoader = new CustomClassLoader(classDir);

        Class<?> applicationClass = classLoader.loadClass("Application");
        System.out.println("Class loaded: " + applicationClass.getName());

        Object applicationInstance = applicationClass.getDeclaredConstructor().newInstance();
        System.out.println("Instance created: " + applicationInstance);

        while (true) {
            System.out.print("Enter r to reload (or 'exit' to quit): ");
            String command = scanner.nextLine();

            if ("exit".equalsIgnoreCase(command)) {
                break;
            }

            if ("r".equalsIgnoreCase(command)) {

                // Loading the class loader again
                CustomClassLoader classLoaderReloaded = new CustomClassLoader(classDir);

                System.out.println("Reloading application...");
                Class<?> applicationClassReloaded = classLoaderReloaded.loadClass("Application");
                System.out.println("Class loaded: " + applicationClassReloaded.getName());

                Object applicationInstanceReloaded = applicationClassReloaded.getDeclaredConstructor().newInstance();
                System.out.println("" + applicationInstanceReloaded.getClass().getMethod("getName")
                        .invoke(applicationInstanceReloaded));
                System.out.println("Instance created: " + applicationInstanceReloaded);
            }

        }

        scanner.close();

    }
}