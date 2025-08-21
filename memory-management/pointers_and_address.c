#include <stdio.h>
#include <stdlib.h>

int main() {
    int* arr = (int*)malloc(5 * sizeof(int));
    if (arr == NULL) {
        fprintf(stderr, "Memory allocation failed\n");
        return 1;
    }

    // Assign values
    for (int i = 0; i < 5; i++) {
        arr[i] = i * 2;
    }

    // Print the address of the allocated memory
    printf("Memory address: %d\n");

    // Print the size of the allocated memory
    printf("Allocated size: %zu bytes\n", 5 * sizeof(int));

    // Print the values
    printf("Values in allocated memory:\n");
    for (int i = 0; i < 5; i++) {
        printf("%d\n", arr[i]);
    }

    free(arr);
    return 0;
}
