const state = {
  vehicles: [],
  workOrders: []
};

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.view).classList.add('active');
  });
});

function showError(message) {
  const banner = document.getElementById('errorBanner');
  banner.textContent = message;
  banner.classList.remove('hidden');
  setTimeout(() => banner.classList.add('hidden'), 5000);
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.error || (data.errors && data.errors.join(' ')) || 'Request failed.';
    throw new Error(message);
  }

  return data;
}

function vehicleNameById(vehicleId) {
  const vehicle = state.vehicles.find(item => item.id === vehicleId);
  return vehicle ? vehicle.name : `Vehicle #${vehicleId}`;
}

function formatDate(value) {
  if (!value) {
    return 'No due date';
  }
  return new Date(`${value}T00:00:00`).toLocaleDateString();
}

async function loadData() {
  try {
    const [vehicles, workOrders] = await Promise.all([
      requestJson('/api/vehicles'),
      requestJson('/api/work-orders')
    ]);

    state.vehicles = vehicles;
    state.workOrders = workOrders;

    renderVehicleSelect();
    renderVehiclesTable();
    renderWorkOrders();
    renderDashboard();
  } catch (error) {
    showError(error.message);
  }
}

function renderDashboard() {
  const totalVehicles = state.vehicles.length;
  const activeVehicles = state.vehicles.filter(vehicle => vehicle.status === 'active').length;
  const inServiceVehicles = state.vehicles.filter(vehicle => vehicle.status === 'in_service').length;
  const openOrders = state.workOrders.filter(order => ['open', 'in_progress'].includes(order.status));

  document.getElementById('statVehicles').textContent = String(totalVehicles);
  document.getElementById('statActive').textContent = String(activeVehicles);
  document.getElementById('statInService').textContent = String(inServiceVehicles);
  document.getElementById('statOpenOrders').textContent = String(openOrders.length);

  const dueSoon = [...openOrders]
    .filter(order => order.dueDate)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 6);

  const dueSoonList = document.getElementById('dueSoonList');
  if (!dueSoon.length) {
    dueSoonList.innerHTML = '<div class="list-item">No open work orders with due dates.</div>';
    return;
  }

  dueSoonList.innerHTML = dueSoon.map(order => `
    <div class="list-item">
      <strong>${order.title}</strong>
      <span>${vehicleNameById(order.vehicleId)} - ${formatDate(order.dueDate)} - ${order.status}</span>
    </div>
  `).join('');
}

function renderVehicleSelect() {
  const select = document.getElementById('workOrderVehicle');
  if (!state.vehicles.length) {
    select.innerHTML = '<option value="">Create a vehicle first</option>';
    return;
  }

  select.innerHTML = state.vehicles.map(vehicle =>
    `<option value="${vehicle.id}">${vehicle.name}</option>`
  ).join('');
}

function renderVehiclesTable() {
  const tbody = document.getElementById('vehiclesTableBody');
  if (!state.vehicles.length) {
    tbody.innerHTML = '<tr><td colspan="6">No vehicles yet.</td></tr>';
    return;
  }

  tbody.innerHTML = state.vehicles.map(vehicle => `
    <tr>
      <td>${vehicle.name}</td>
      <td>${vehicle.type}</td>
      <td>${vehicle.status}</td>
      <td>${Number(vehicle.odometer).toLocaleString()}</td>
      <td>${vehicle.licensePlate || '-'}</td>
      <td>
        <button class="btn-secondary inline-btn" data-action="edit-vehicle" data-id="${vehicle.id}">Edit</button>
        <button class="btn-secondary inline-btn danger" data-action="delete-vehicle" data-id="${vehicle.id}">Delete</button>
      </td>
    </tr>
  `).join('');
}

function renderWorkOrders() {
  const container = document.getElementById('workOrdersByVehicle');
  if (!state.vehicles.length) {
    container.innerHTML = '<div class="project-group"><div class="project-header-row"><h3 class="project-title">No vehicles available</h3></div></div>';
    return;
  }

  container.innerHTML = state.vehicles.map(vehicle => {
    const orders = state.workOrders.filter(order => order.vehicleId === vehicle.id);

    const orderHtml = orders.length
      ? orders.map(order => `
        <div class="task-item ${order.status === 'completed' ? 'completed' : ''}">
          <div class="task-content">
            <strong>${order.title}</strong>
            <span>${order.description || 'No description'} | ${order.status} | ${formatDate(order.dueDate)}</span>
          </div>
          <div class="task-actions">
            <button class="btn-secondary inline-btn" data-action="edit-work-order" data-id="${order.id}">Edit</button>
            <button class="btn-secondary inline-btn danger" data-action="delete-work-order" data-id="${order.id}">Delete</button>
          </div>
        </div>
      `).join('')
      : '<div class="task-item"><div class="task-content">No work orders for this vehicle.</div></div>';

    return `
      <div class="project-group">
        <div class="project-header-row">
          <div class="collapse-icon">▼</div>
          <h3 class="project-title">${vehicle.name}</h3>
          <div class="project-meta">${orders.length} orders</div>
        </div>
        <div class="project-tasks">${orderHtml}</div>
      </div>
    `;
  }).join('');

  document.querySelectorAll('.project-header-row').forEach(header => {
    header.addEventListener('click', event => {
      if (event.target.closest('button')) {
        return;
      }
      const group = header.closest('.project-group');
      const tasks = group.querySelector('.project-tasks');
      const icon = header.querySelector('.collapse-icon');
      tasks.classList.toggle('collapsed');
      icon.textContent = tasks.classList.contains('collapsed') ? '►' : '▼';
    });
  });
}

function resetVehicleForm() {
  document.getElementById('vehicleId').value = '';
  document.getElementById('vehicleName').value = '';
  document.getElementById('vehicleType').value = '';
  document.getElementById('vehicleVin').value = '';
  document.getElementById('vehiclePlate').value = '';
  document.getElementById('vehicleStatus').value = 'active';
  document.getElementById('vehicleOdometer').value = '';
  document.getElementById('vehicleLastService').value = '';
  document.getElementById('vehicleNotes').value = '';
  document.getElementById('vehicleSubmitBtn').textContent = 'Create Vehicle';
}

function resetWorkOrderForm() {
  document.getElementById('workOrderId').value = '';
  document.getElementById('workOrderTitle').value = '';
  document.getElementById('workOrderStatus').value = 'open';
  document.getElementById('workOrderDueDate').value = '';
  document.getElementById('workOrderDescription').value = '';
  document.getElementById('workOrderSubmitBtn').textContent = 'Create Work Order';
}

document.getElementById('vehicleForm').addEventListener('submit', async event => {
  event.preventDefault();
  const vehicleId = document.getElementById('vehicleId').value;

  const payload = {
    name: document.getElementById('vehicleName').value,
    type: document.getElementById('vehicleType').value,
    vin: document.getElementById('vehicleVin').value,
    licensePlate: document.getElementById('vehiclePlate').value,
    status: document.getElementById('vehicleStatus').value,
    odometer: Number(document.getElementById('vehicleOdometer').value),
    lastServiceDate: document.getElementById('vehicleLastService').value,
    notes: document.getElementById('vehicleNotes').value
  };

  try {
    if (vehicleId) {
      await requestJson(`/api/vehicles/${vehicleId}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
    } else {
      await requestJson('/api/vehicles', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }

    resetVehicleForm();
    await loadData();
  } catch (error) {
    showError(error.message);
  }
});

document.getElementById('vehicleResetBtn').addEventListener('click', resetVehicleForm);

document.getElementById('workOrderForm').addEventListener('submit', async event => {
  event.preventDefault();
  const workOrderId = document.getElementById('workOrderId').value;

  const payload = {
    vehicleId: Number(document.getElementById('workOrderVehicle').value),
    title: document.getElementById('workOrderTitle').value,
    status: document.getElementById('workOrderStatus').value,
    dueDate: document.getElementById('workOrderDueDate').value,
    description: document.getElementById('workOrderDescription').value
  };

  try {
    if (workOrderId) {
      await requestJson(`/api/work-orders/${workOrderId}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
    } else {
      await requestJson('/api/work-orders', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }

    resetWorkOrderForm();
    await loadData();
  } catch (error) {
    showError(error.message);
  }
});

document.getElementById('workOrderResetBtn').addEventListener('click', resetWorkOrderForm);

document.body.addEventListener('click', async event => {
  const button = event.target.closest('button[data-action]');
  if (!button) {
    return;
  }

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  try {
    if (action === 'edit-vehicle') {
      const vehicle = state.vehicles.find(item => item.id === id);
      if (!vehicle) return;

      document.getElementById('vehicleId').value = vehicle.id;
      document.getElementById('vehicleName').value = vehicle.name;
      document.getElementById('vehicleType').value = vehicle.type;
      document.getElementById('vehicleVin').value = vehicle.vin || '';
      document.getElementById('vehiclePlate').value = vehicle.licensePlate || '';
      document.getElementById('vehicleStatus').value = vehicle.status;
      document.getElementById('vehicleOdometer').value = vehicle.odometer;
      document.getElementById('vehicleLastService').value = vehicle.lastServiceDate || '';
      document.getElementById('vehicleNotes').value = vehicle.notes || '';
      document.getElementById('vehicleSubmitBtn').textContent = 'Update Vehicle';
    }

    if (action === 'delete-vehicle') {
      const confirmed = window.confirm('Delete this vehicle?');
      if (!confirmed) return;

      try {
        await requestJson(`/api/vehicles/${id}`, { method: 'DELETE' });
      } catch (error) {
        if (error.message.includes('open work orders')) {
          const force = window.confirm('Vehicle has open work orders. Force delete vehicle and its work orders?');
          if (!force) return;
          await requestJson(`/api/vehicles/${id}?force=true`, { method: 'DELETE' });
        } else {
          throw error;
        }
      }

      await loadData();
    }

    if (action === 'edit-work-order') {
      const order = state.workOrders.find(item => item.id === id);
      if (!order) return;

      document.getElementById('workOrderId').value = order.id;
      document.getElementById('workOrderVehicle').value = String(order.vehicleId);
      document.getElementById('workOrderTitle').value = order.title;
      document.getElementById('workOrderStatus').value = order.status;
      document.getElementById('workOrderDueDate').value = order.dueDate || '';
      document.getElementById('workOrderDescription').value = order.description || '';
      document.getElementById('workOrderSubmitBtn').textContent = 'Update Work Order';
    }

    if (action === 'delete-work-order') {
      const confirmed = window.confirm('Delete this work order?');
      if (!confirmed) return;

      await requestJson(`/api/work-orders/${id}`, { method: 'DELETE' });
      await loadData();
    }
  } catch (error) {
    showError(error.message);
  }
});

loadData();
