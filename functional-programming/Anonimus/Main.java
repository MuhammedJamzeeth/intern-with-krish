class Main{
	public static void main(String args[]){
		System.out.println("Hello");
		Human human = new Human(){
		public void move(){
			System.out.println("Moving");
}
};
		human.move();
}
}