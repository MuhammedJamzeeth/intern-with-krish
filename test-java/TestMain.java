import java.util.function.Consumer;

class TestMain {
    public static void main(String[] args) {
        Consumer<String> consumer = (text) -> System.out.println(text.length());
        consumer.accept("hello");
    }
}
