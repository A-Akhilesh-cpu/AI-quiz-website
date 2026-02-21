const defaultQuestions = {
    Math: [
        { id: 1, question: "What is the value of π (pi) rounded to two decimal places?", options: ["3.14", "3.16", "3.12", "3.18"], correctAnswer: 0, explanation: "π (pi) is approximately 3.14159..., which rounds to 3.14 at two decimal places." },
        { id: 2, question: "What is the derivative of x²?", options: ["x", "2x", "2x²", "x²"], correctAnswer: 1, explanation: "Using the power rule, d/dx(x²) = 2x¹ = 2x." },
        { id: 3, question: "What is the integral of 2x dx?", options: ["x²", "x² + C", "2x²", "x + C"], correctAnswer: 1, explanation: "The integral of 2x is x² + C, where C is the constant of integration." },
        { id: 4, question: "What is the value of log₁₀(1000)?", options: ["2", "3", "4", "10"], correctAnswer: 1, explanation: "log₁₀(1000) = 3 because 10³ = 1000." },
        { id: 5, question: "In a right triangle, if one angle is 90° and another is 45°, what is the third angle?", options: ["30°", "45°", "60°", "90°"], correctAnswer: 1, explanation: "The sum of angles in a triangle is 180°. So 180° - 90° - 45° = 45°." },
        { id: 6, question: "What is 15! / 13! equal to?", options: ["210", "180", "120", "30"], correctAnswer: 0, explanation: "15!/13! = 15 × 14 = 210, since all terms below 14 cancel out." },
        { id: 7, question: "What is the sum of interior angles of a hexagon?", options: ["540°", "720°", "900°", "1080°"], correctAnswer: 1, explanation: "Sum of interior angles = (n-2) × 180° = (6-2) × 180° = 720°." },
        { id: 8, question: "What is the value of √(144)?", options: ["10", "11", "12", "13"], correctAnswer: 2, explanation: "√144 = 12 because 12 × 12 = 144." },
        { id: 9, question: "If f(x) = 3x + 7, what is f(5)?", options: ["15", "22", "20", "25"], correctAnswer: 1, explanation: "f(5) = 3(5) + 7 = 15 + 7 = 22." },
        { id: 10, question: "What is the LCM of 12 and 18?", options: ["24", "36", "54", "72"], correctAnswer: 1, explanation: "LCM(12,18) = 36. The smallest number divisible by both 12 and 18 is 36." },
    ],
    Python: [
        { id: 1, question: "What is the output of print(type(5))?", options: ["<class 'float'>", "<class 'int'>", "<class 'str'>", "<class 'num'>"], correctAnswer: 1, explanation: "5 is a whole number, so Python treats it as an integer (int)." },
        { id: 2, question: "Which keyword is used to define a function in Python?", options: ["func", "define", "def", "function"], correctAnswer: 2, explanation: "'def' is the Python keyword used to define functions, e.g., def my_function()." },
        { id: 3, question: "What does 'len([1, 2, 3])' return?", options: ["2", "3", "4", "1"], correctAnswer: 1, explanation: "len() returns the number of elements in a list. [1, 2, 3] has 3 elements." },
        { id: 4, question: "Which data type is immutable in Python?", options: ["List", "Dictionary", "Set", "Tuple"], correctAnswer: 3, explanation: "Tuples are immutable — once created, their elements cannot be changed." },
        { id: 5, question: "What is the output of 'Hello'[1]?", options: ["H", "e", "l", "o"], correctAnswer: 1, explanation: "String indexing starts at 0, so index 1 is the second character 'e'." },
        { id: 6, question: "Which operator is used for floor division in Python?", options: ["/", "//", "%", "**"], correctAnswer: 1, explanation: "// performs floor division, returning the largest integer less than or equal to the result." },
        { id: 7, question: "What does the 'pass' statement do?", options: ["Exits loop", "Skips iteration", "Does nothing", "Returns None"], correctAnswer: 2, explanation: "'pass' is a null operation — it does nothing and is used as a placeholder." },
        { id: 8, question: "How do you create a list comprehension in Python?", options: ["[x for x in range(5)]", "{x for x in range(5)}", "(x for x in range(5))", "<x for x in range(5)>"], correctAnswer: 0, explanation: "List comprehensions use square brackets: [expression for item in iterable]." },
        { id: 9, question: "Which method adds an element at the end of a list?", options: ["add()", "push()", "append()", "insert()"], correctAnswer: 2, explanation: "append() adds a single element to the end of a list." },
        { id: 10, question: "What is the output of bool('')?", options: ["True", "False", "None", "Error"], correctAnswer: 1, explanation: "Empty strings are falsy in Python, so bool('') returns False." },
    ],
    DBMS: [
        { id: 1, question: "What does SQL stand for?", options: ["Structured Query Language", "Simple Query Language", "Standard Query Language", "Sequential Query Language"], correctAnswer: 0, explanation: "SQL stands for Structured Query Language, used to manage relational databases." },
        { id: 2, question: "Which normal form removes partial dependencies?", options: ["1NF", "2NF", "3NF", "BCNF"], correctAnswer: 1, explanation: "2NF removes partial dependencies — every non-key attribute must depend on the entire primary key." },
        { id: 3, question: "What is a primary key?", options: ["A key that allows NULL", "A unique identifier for records", "A foreign reference", "An index column"], correctAnswer: 1, explanation: "A primary key uniquely identifies each record in a table and cannot be NULL." },
        { id: 4, question: "Which SQL clause is used to filter grouped results?", options: ["WHERE", "GROUP BY", "HAVING", "ORDER BY"], correctAnswer: 2, explanation: "HAVING filters groups after GROUP BY, while WHERE filters individual rows before grouping." },
        { id: 5, question: "What type of join returns all rows from both tables?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"], correctAnswer: 3, explanation: "FULL OUTER JOIN returns all rows from both tables, with NULLs where there's no match." },
        { id: 6, question: "What does ACID stand for in database transactions?", options: ["Atomicity, Consistency, Isolation, Durability", "Association, Consistency, Isolation, Data", "Atomicity, Completeness, Isolation, Durability", "Atomicity, Consistency, Integration, Durability"], correctAnswer: 0, explanation: "ACID ensures reliable transactions: Atomicity, Consistency, Isolation, and Durability." },
        { id: 7, question: "Which command is used to remove a table from a database?", options: ["DELETE TABLE", "REMOVE TABLE", "DROP TABLE", "CLEAR TABLE"], correctAnswer: 2, explanation: "DROP TABLE removes the entire table structure and data from the database." },
        { id: 8, question: "What is a foreign key?", options: ["Primary key of same table", "Key referencing another table's primary key", "Unique key", "Composite key"], correctAnswer: 1, explanation: "A foreign key references the primary key of another table, creating a relationship between tables." },
        { id: 9, question: "Which SQL command is used to update existing data?", options: ["MODIFY", "ALTER", "UPDATE", "CHANGE"], correctAnswer: 2, explanation: "UPDATE modifies existing records: UPDATE table SET column = value WHERE condition." },
        { id: 10, question: "What is normalization in DBMS?", options: ["Adding redundancy", "Process of organizing data to reduce redundancy", "Creating backups", "Encrypting data"], correctAnswer: 1, explanation: "Normalization organizes data to minimize redundancy and dependency, improving data integrity." },
    ],
    Aptitude: [
        { id: 1, question: "A train travels 360 km in 6 hours. What is its speed?", options: ["50 km/h", "55 km/h", "60 km/h", "65 km/h"], correctAnswer: 2, explanation: "Speed = Distance/Time = 360/6 = 60 km/h." },
        { id: 2, question: "If 5x + 3 = 28, what is x?", options: ["3", "4", "5", "6"], correctAnswer: 2, explanation: "5x + 3 = 28 → 5x = 25 → x = 5." },
        { id: 3, question: "What is the next number in the series: 2, 6, 12, 20, ?", options: ["28", "30", "32", "36"], correctAnswer: 1, explanation: "Differences: 4, 6, 8, ... next difference is 10, so 20 + 10 = 30." },
        { id: 4, question: "A shopkeeper sells an item at 20% profit. If cost price is ₹500, what is the selling price?", options: ["₹550", "₹580", "₹600", "₹620"], correctAnswer: 2, explanation: "Selling price = 500 + 20% of 500 = 500 + 100 = ₹600." },
        { id: 5, question: "If A can do a work in 10 days and B in 15 days, together they complete it in?", options: ["5 days", "6 days", "7 days", "8 days"], correctAnswer: 1, explanation: "Combined rate = 1/10 + 1/15 = 5/30 = 1/6. So together they finish in 6 days." },
        { id: 6, question: "What is 40% of 250?", options: ["80", "90", "100", "110"], correctAnswer: 2, explanation: "40% of 250 = (40/100) × 250 = 100." },
        { id: 7, question: "The ratio of boys to girls in a class is 3:2. If there are 30 boys, how many girls are there?", options: ["15", "18", "20", "25"], correctAnswer: 2, explanation: "3:2 ratio with 30 boys means each part = 10, so girls = 2 × 10 = 20." },
        { id: 8, question: "A clock shows 3:15. What is the angle between the hands?", options: ["0°", "7.5°", "15°", "22.5°"], correctAnswer: 1, explanation: "At 3:15, the minute hand is at 90°. The hour hand moved 7.5° past the 3, so it's at 97.5°. Angle = 7.5°." },
        { id: 9, question: "Find the simple interest on ₹1000 at 5% per annum for 2 years.", options: ["₹50", "₹100", "₹150", "₹200"], correctAnswer: 1, explanation: "SI = (P × R × T)/100 = (1000 × 5 × 2)/100 = ₹100." },
        { id: 10, question: "The average of 5 numbers is 20. If one number is removed, the average becomes 18. What is the removed number?", options: ["24", "26", "28", "30"], correctAnswer: 2, explanation: "Sum of 5 numbers = 100. Sum of 4 numbers = 72. Removed number = 100 - 72 = 28." },
    ],
};

export function getQuestionsBySubject(subject) {
    try {
        const stored = localStorage.getItem('quizQuestions');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed[subject] && parsed[subject].length > 0) {
                return parsed[subject];
            }
        }
    } catch { /* ignore corrupted data */ }
    return defaultQuestions[subject] || [];
}

export function getSubjects() {
    let storedSubjects = [];
    try {
        const stored = localStorage.getItem('quizQuestions');
        storedSubjects = stored ? Object.keys(JSON.parse(stored)) : [];
    } catch { /* ignore */ }
    const defaultSubjects = Object.keys(defaultQuestions);
    return [...new Set([...defaultSubjects, ...storedSubjects])];
}

export function getAllQuestions() {
    const merged = { ...defaultQuestions };
    try {
        const stored = localStorage.getItem('quizQuestions');
        const storedQuestions = stored ? JSON.parse(stored) : {};
        for (const subject in storedQuestions) {
            merged[subject] = storedQuestions[subject];
        }
    } catch { /* ignore */ }
    return merged;
}

export function saveQuestions(subject, questions) {
    const stored = localStorage.getItem('quizQuestions');
    const all = stored ? JSON.parse(stored) : {};
    all[subject] = questions;
    localStorage.setItem('quizQuestions', JSON.stringify(all));
}

export default defaultQuestions;
