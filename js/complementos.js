// Cargar los datos del JSON de complementos
fetch('./json/complementos.json')
  .then(res => {
    if (!res.ok) throw new Error("Error de red");
    return res.json();
  })
  .then(data => {
    const container = document.getElementById('menu-container');
    let currentCategory = '';
    data.forEach(item => {
      if (item.categoria !== currentCategory) {
        currentCategory = item.categoria;
        container.innerHTML += `<section class="categoria"> ${currentCategory}</section>`;
      }
      container.innerHTML += `
        <div class="menu-item">
          <img src="${item.imagen}" alt="${item.nombre}" id="${item.id}">
          <h3>${item.nombre}</h3>
          <p>${item.descripcion}</p>
          <strong>$${item.precio.toFixed(2)}</strong>
        </div>`;
    });
  })
  .catch(err => console.error("Error al cargar el menú:", err));