import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class CustomClassLoader extends ClassLoader {
    private final String classDir;

    public CustomClassLoader(String claaString) {
        super(CustomClassLoader.class.getClassLoader());
        this.classDir = claaString;
    }

    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        try {
            String fileName = name.replace('.','/') + ".class";
            Path classPath = Paths.get(classDir, fileName);

            byte[] classData = Files.readAllBytes(classPath);
            
            return defineClass(name, classData, 0, classData.length);
        } catch (IOException e) {
            throw new ClassNotFoundException("Could not load class " + name, e);
        }
    }
}