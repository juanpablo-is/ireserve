document.addEventListener("DOMContentLoaded", function (event) {
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.forEach(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
});