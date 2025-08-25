class Main{
	public static void main(String args[]){
		System.out.println("Hello");
		Human human = () -> System.out.println("Moving");
		human.move();
}
}