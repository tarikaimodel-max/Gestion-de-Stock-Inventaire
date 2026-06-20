document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            let isValid = true;
            
            // Supprimer les anciens messages d'erreur
            form.querySelectorAll('.dynamic-error').forEach(el => el.remove());

            // Vérifier tous les champs avec l'attribut required
            const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    
                    // Création de l'élément message d'erreur
                    const error = document.createElement('div');
                    error.className = 'dynamic-error alert-error';
                    error.style.color = '#d9534f';
                    error.style.fontSize = '0.85em';
                    error.style.marginTop = '5px';
                    error.innerText = 'Ce champ est requis.';
                    
                    // Insérer après l'input
                    input.parentNode.appendChild(error);
                    
                    // Ajouter une bordure rouge pour indiquer l'erreur
                    input.style.borderColor = '#d9534f';
                    
                    // Enlever la bordure rouge quand l'utilisateur commence à taper
                    input.addEventListener('input', function removeError() {
                        input.style.borderColor = '';
                        if (error.parentNode) {
                            error.parentNode.removeChild(error);
                        }
                        input.removeEventListener('input', removeError);
                    });
                }
            });

            if (!isValid) {
                e.preventDefault(); // Empêcher la soumission
            }
        });
    });
});
