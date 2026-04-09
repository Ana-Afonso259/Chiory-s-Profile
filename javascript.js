function setDesign(type) {
    const left = document.getElementById("leftPanel");

    left.classList.remove("design1", "design2");
    left.classList.add(type);
}

