document.addEventListener("DOMContentLoaded", function() {
    const firstNameInput = document.getElementById("first-name");
    const lastNameInput = document.getElementById("last-name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const salaryInput = document.getElementById("salary");
    const locationInput = document.getElementById("location");
    const resumeInput = document.getElementById('resume');
    const uploadedResumeInput = document.getElementById('uploaded-resume');
    resumeInput.addEventListener('change', function() {
        const file = resumeInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const fileContent = e.target.result;
                console.log(file)
                console.log(fileContent)
                const resume = {
                    name: file.name,
                    content: fileContent,
                    type: file.type
                };
                chrome.storage.local.set({
                    resume: resume
                })
            };
            reader.readAsDataURL(file);
        }
    });
    chrome.storage.local.get(["profile"], function(result) {
        firstNameInput.value = result.profile.firstName
        lastNameInput.value = result.profile.lastName
        emailInput.value = result.profile.email
        phoneInput.value = result.profile.phone
        salaryInput.value = result.profile.salary
        locationInput.value = result.profile.location
    });
    chrome.storage.local.get(["resume"], function(result) {
        uploadedResumeInput.textContent = result.resume.name
    });
    const saveButton = document.querySelector(".btn-save");
    saveButton.addEventListener("click", function() {
        const profile = {
            firstName: firstNameInput.value,
            lastName: lastNameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            salary: salaryInput.value,
            location: locationInput.value,
        };
        chrome.storage.local.set({
            profile: profile
        }).then(() => {
            alert("Data saved successfully!");
        });
    });

    document.getElementById('fill-it').addEventListener('click', function () {
      chrome.runtime.sendMessage({ message: 'fill' });
    });
});