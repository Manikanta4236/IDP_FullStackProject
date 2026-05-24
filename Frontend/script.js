async function login() {
    // 1. Get the values entered by the user
    let emailInput = document.getElementById("email").value.trim();
    let passwordInput = document.getElementById("password").value.trim();
    let errorParagraph = document.getElementById("error");

    // Clear any previous error messages
    if (errorParagraph) {
        errorParagraph.innerHTML = "";
    }

    // 2. Simple Validation Check
    if (emailInput === "" || passwordInput === "") {
        if (errorParagraph) {
            errorParagraph.innerHTML = "❌ Please fill in both fields.";
        } else {
            alert("Please fill in both fields.");
        }
        return;
    }

    // 3. Prepare the credentials data payload
    const credentials = {
        email: emailInput,
        password: passwordInput
    };

    try {
        if (errorParagraph) {
            errorParagraph.style.color = "orange";
            errorParagraph.innerHTML = "Processing authentication...";
        }

        // 4. Send a POST request to your backend server
        const response = await fetch("http://localhost:5000/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();

        // 5. Handle Server Response
        if (response.ok) {
            // Save the username sent by the backend to sessionStorage
            sessionStorage.setItem("username", data.username);
            
            // Redirect to your dashboard page
            window.location.href = "dashboard.html";
        } else {
            // Display server validation messages (e.g., incorrect password for existing user)
            if (errorParagraph) {
                errorParagraph.style.color = "red";
                errorParagraph.innerHTML = `❌ ${data.error || "Authentication failed."}`;
            } else {
                alert(data.error || "Authentication failed.");
            }
        }
    } catch (error) {
        console.error("Authentication Error:", error);
        const errorMsg = "⚠️ Connection Error: Is your server.js running on port 5000?";
        if (errorParagraph) {
            errorParagraph.style.color = "red";
            errorParagraph.innerHTML = errorMsg;
        } else {
            alert(errorMsg);
        }
    }
}