// Sample data points (x, y)
const dataPoints = [
    { x: 1, y: 2 },
    { x: 2, y: 3 },
    { x: 3, y: 5 },
    { x: 4, y: 4 },
    { x: 5, y: 6 }
];

// Degree of the polynomial to fit
const degree = 2;

// Function to create the Vandermonde matrix
function createVandermondeMatrix(dataPoints, degree) {
    // Map each data point to a row in the Vandermonde matrix
    return dataPoints.map(point => {
        const row = [];
        // For each degree from 0 to the specified degree, compute x^i and add to the row
        for (let i = 0; i <= degree; i++) {
            row.push(Math.pow(point.x, i));
        }
        return row;
    });
}

// Function to transpose a matrix
function transposeMatrix(matrix) {
    // Transpose the matrix by swapping rows with columns
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex])); // the _ indicates that the parameter is unused
}

// Function to multiply two matrices
function multiplyMatrices(A, B) {
    // Multiply matrices A and B
    return A.map(row =>
        B[0].map((_, colIndex) =>
            row.reduce((sum, elem, rowIndex) => sum + elem * B[rowIndex][colIndex], 0)
        )
    ); // the _ indicates that the parameter is unused
}

// Function to invert a matrix using Gaussian elimination
function invertMatrix(matrix) {
    const size = matrix.length;
    // Augment the matrix with the identity matrix
    const augmentedMatrix = matrix.map((row, i) =>
        row.concat(Array.from({ length: size }, (_, j) => (i === j ? 1 : 0)))
    ); // the _ indicates that the parameter is unused

    // Perform Gaussian elimination
    for (let i = 0; i < size; i++) {
        // Make the diagonal contain all 1s
        const factor = augmentedMatrix[i][i];
        for (let j = 0; j < 2 * size; j++) {
            augmentedMatrix[i][j] /= factor;
        }

        // Make the other rows contain 0s
        for (let k = 0; k < size; k++) {
            if (k !== i) {
                const factor = augmentedMatrix[k][i];
                for (let j = 0; j < 2 * size; j++) {
                    augmentedMatrix[k][j] -= factor * augmentedMatrix[i][j];
                }
            }
        }
    }

    // Extract the right half of the augmented matrix as the inverse
    return augmentedMatrix.map(row => row.slice(size));
}

// Function to perform polynomial regression
function polynomialRegression(dataPoints, degree) {
    // Create the Vandermonde matrix
    const vandermondeMatrix = createVandermondeMatrix(dataPoints, degree);

    // Create the transpose of the Vandermonde matrix
    const vandermondeMatrixT = transposeMatrix(vandermondeMatrix);

    // Create the Y matrix (vector of y values)
    const yMatrix = dataPoints.map(point => [point.y]);

    // Calculate (X^T * X)^-1 * X^T * Y
    const XT_X = multiplyMatrices(vandermondeMatrixT, vandermondeMatrix); // X^T * X
    const XT_X_inv = invertMatrix(XT_X); // (X^T * X)^-1
    const XT_Y = multiplyMatrices(vandermondeMatrixT, yMatrix); // X^T * Y
    const coefficients = multiplyMatrices(XT_X_inv, XT_Y); // (X^T * X)^-1 * X^T * Y

    // Return the coefficients as a flat array
    return coefficients.map(row => row[0]);
}

// Perform polynomial regression
const coefficients = polynomialRegression(dataPoints, degree);
console.log(`Polynomial coefficients (degree ${degree}):`, coefficients); // Output the coefficients
