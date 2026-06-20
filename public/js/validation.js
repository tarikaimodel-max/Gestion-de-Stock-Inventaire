document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            let isValid = true;
            
            // On cible tous les inputs qui ne sont pas de type submit, hidden ou button
            // On exclut aussi le mot de passe de modification qui est optionnel
            const inputs = form.querySelectorAll('input:not([type="submit"]):not([type="hidden"]):not([type="button"]):not(#editPassword)');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = '';
                }
            });

            if (!isValid) {
                e.preventDefault(); // Empêche l'envoi
                alert("Tous les champs sont obligatoires !");
            }
        });
    });
});
