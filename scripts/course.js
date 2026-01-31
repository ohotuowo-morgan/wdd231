const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
        technology: [
            'Python'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.',
        technology: [
            'HTML',
            'CSS'
        ],
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.',
        technology: [
            'Python'
        ],
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.',
        technology: [
            'C#'
        ],
        completed: false
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
        technology: [
            'HTML',
            'CSS',
            'JavaScript'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
        technology: [
            'HTML',
            'CSS',
            'JavaScript'
        ],
        completed: false
    }
]

function createCourseCards(data) {
    document.querySelector("#container").innerHTML = "";

    data.forEach(course => {

        let card = document.createElement("button");
        let name = document.createElement("h3");
        name.textContent = `${course.subject} ${course.number}`;

        if (course.completed) {
            let checkMark = document.createElement("span");
            checkMark.textContent = "\u2713";
            name.appendChild(checkMark);
        }

        let title = document.createElement("p");


        card.classList.add("card-btn");

        card.appendChild(name);

        card.addEventListener('click', () => {
            displayCourseDetails(course);
        });

        document.querySelector("#container").appendChild(card);

        // Calculate Total Credits (Only for Completed Courses)
        const total = data.reduce((acc, course) => {
            if (course.completed) {
                return acc + course.credits;
            }
            // Otherwise, just return the current total without adding anything
            return acc;
        }, 0);

        document.getElementById("total-credits").innerHTML = total;
    });

}

createCourseCards(courses);

const buttons = document.querySelectorAll(".btn");

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        if (btn.classList.contains("all")) {
            createCourseCards(courses);
        } else if (btn.classList.contains("cse")) {
            createCourseCards(courses.filter(c => c.subject === "CSE"));
        } else if (btn.classList.contains("wdd")) {
            createCourseCards(courses.filter(c => c.subject === "WDD"));
        }

        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    });
});

const courseDetails = document.querySelector("#course-details");

function displayCourseDetails(course) {
    courseDetails.innerHTML = `
        <button id="closeModal">❌</button>
        <h2>${course.subject} ${course.number}</h2>
        <h3>${course.title}</h3>
        <p><strong>Credits</strong>: ${course.credits}</p>
        <p><strong>Certificate</strong>: ${course.certificate}</p>
        <p>${course.description}</p>
        <p><strong>Technologies</strong>: ${course.technology.join(', ')}</p>
    `;
    
    courseDetails.showModal();

    // Close Modal on Button Click
    const closeModal = document.querySelector("#closeModal");
    closeModal.addEventListener("click", () => {
        courseDetails.close();
    });
}

// Close Modal when clicking outside the box (on the backdrop)
courseDetails.addEventListener("click", (event) => {
    if (event.target === courseDetails) {
        courseDetails.close();
    }
});