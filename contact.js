document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const formMessage = document.getElementById('form-message');
            
            fetch('php/save_contact.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    formMessage.textContent = 'Thank you for your message! I will get back to you soon.';
                    formMessage.className = 'success';
                    contactForm.reset();
                } else {
                    formMessage.textContent = 'There was an error sending your message. Please try again later.';
                    formMessage.className = 'error';
                }
                formMessage.style.display = 'block';
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            })
            .catch(error => {
                console.error('Error:', error);
                formMessage.textContent = 'There was an error sending your message. Please try again later.';
                formMessage.className = 'error';
                formMessage.style.display = 'block';
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            });
        });
    }
});