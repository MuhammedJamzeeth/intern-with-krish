public class TestApp {
    public static void main(String[] args) throws Exception {
        String classDir = "J:/Fortude/intern-krish/classloader-test/target/classes";

        CustomClassLoader classLoader = new CustomClassLoader(classDir);

        Class<?> employeeClass = classLoader.loadClass("org.distance.Employee");
        System.out.println("Class loaded: " + employeeClass.getName());

        Object employeeInstance = employeeClass.getDeclaredConstructor().newInstance();
        System.out.println("Instance created: " + employeeInstance);

    }
}