
import Auth from './Auth.jsx';
import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

const services = [
  { icon: '🏍', name: 'Ojek Motor', desc: 'Cepat dan praktis' },
    { icon:'🚕', name: 'Antar Mobil', desc: 'Nyaman bersama keluarga' },
      { icon: '📦', name: 'Kirim Barang', desc: 'Paket sampai tujuan' },
        { icon: '📍', name: 'Antar Jemput', desc: 'Jemput sesuai lokasi' },
        ];

        export default function App() {
          const [selected, setSelected] = useState('Ojek Motor');
            const [pickup, setPickup] = useState('');
              const [destination, setDestination] = useState('');
const [orders, setOrders] = useState([]);
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session);
        setAuthReady(true);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthReady(true);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

               useEffect(() => {
  if (!session) {
    setOrders([]);
    return;
  }

  let active = true;

  async function loadOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (!active) return;

    if (error) {
      alert('Gagal memuat pesanan: ' + error.message);
      return;
    }

    setOrders(data.map(order => ({
      ...order,
      createdAt: new Date(order.created_at).toLocaleString('id-ID'),
      status: order.status === 'menunggu'
        ? 'Menunggu'
        : order.status === 'dibatalkan'
          ? 'Dibatalkan'
          : order.status
    })));
  }

  loadOrders();

  return () => {
    active = false;
  };
}, [session]);

async function clearOrders() {
  const confirmDelete = window.confirm(
    'Yakin ingin menghapus semua riwayat pesanan?'
  );

  if (!confirmDelete) return;

  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('user_id', session.user.id);

  if (error) {
    alert('Gagal menghapus riwayat: ' + error.message);
    return;
  }

  setOrders([]);
}

async function cancelOrder(id) {
  const confirmCancel = window.confirm(
    'Yakin ingin membatalkan pesanan ini?'
  );

  if (!confirmCancel) return;

  const { error } = await supabase
    .from('orders')
    .update({ status: 'dibatalkan' })
    .eq('id', id)
    .eq('user_id', session.user.id);

  if (error) {
    alert('Gagal membatalkan pesanan: ' + error.message);
    return;
  }

  setOrders(prev => prev.map(order =>
    order.id === id
      ? { ...order, status: 'Dibatalkan' }
      : order
  ));
}

async function handleBooking(e) {
  e.preventDefault();

  if (!pickup.trim() || !destination.trim()) {
    alert('Isi lokasi penjemputan dan tujuan terlebih dahulu!');
    return;
  }

  const { data, error } = await supabase
    .from('orders')
    .insert({
      service: selected,
      pickup: pickup.trim(),
      destination: destination.trim(),
      status: 'menunggu',
      user_id: session.user.id
    })
    .select()
    .single();

  if (error) {
    alert('Gagal menyimpan pesanan: ' + error.message);
    return;
  }

  const order = {
    ...data,
    createdAt: new Date(data.created_at).toLocaleString('id-ID'),
    status: 'Menunggu'
  };

  setOrders(prev => [order, ...prev]);
  alert('Pesanan berhasil disimpan!');

  setPickup('');
  setDestination('');
}

if (!authReady) return <p>Memuat AntarYuk...</p>;
  if (!session) return <Auth />;

                                                return (
                                                    <div className="app">
                                                          <header className="topbar">
                                                                  <div className="brand">
                                                                            <div className="brand-icon">A</div>
                                                                                      <div>
                                                                                                  <h1>AntarYuk</h1>
                                                                                                              <span>INDONESIA</span>
                                                                                                                        </div>
                                                                                                                                </div>
                                                                                                                                        <div className="header-actions">
  <div className="location-badge">
    📍 Maluku Utara
  </div>
  <div className="profile-avatar" title="Profil pengguna">
    {(session?.user?.user_metadata?.full_name || session?.user?.email || 'A')
      .charAt(0).toUpperCase()}
  </div>
  <button
    type="button"
    className="logout-button"
    onClick={() => supabase.auth.signOut()}
  >
    Logout
  </button>
</div>
                                                                                                                                              </header>

                                                                                                                                                    <main>
                                                                                                                                                            <section className="hero">
                                                                                                                                                                      <div className="hero-content">
                                                                                                                                                                                  <span className="hero-label">🚀 PARTNER PERJALANANMU</span>
                                                                                                                                                                                              <h2>Ke mana pun,<br />AntarYuk aja!</h2>
                                                                                                                                                                                                          <p>Pesan perjalanan dan pengiriman barang dengan mudah dalam satu aplikasi.</p>
                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                              <div className="hero-illustration">🛵</div>
                                                                                                                                                                                                                                      </section>

                                                                                                                                                                                                                                              <section className="services-section">
                                                                                                                                                                                                                                                        <h2>Layanan kami</h2>
                                                                                                                                                                                                                                                                  <p>Pilih layanan yang kamu butuhkan</p>
                                                                                                                                                                                                                                                                            <div className="services">
                                                                                                                                                                                                                                                                                        {services.map((service) => (
                                                                                                                                                                                                                                                                                                      <button
                                                                                                                                                                                                                                                                                                                      type="button"
                                                                                                                                                                                                                                                                                                                                      key={service.name}
                                                                                                                                                                                                                                                                                                                                                      className={`service ${selected === service.name ? 'active' : ''}`}
                                                                                                                                                                                                                                                                                                                                                                      onClick={() => setSelected(service.name)}
                                                                                                                                                                                                                                                                                                                                                                                    >
                                                                                                                                                                                                                                                                                                                                                                                                    <span className="service-icon">{service.icon}</span>
                                                                                                                                                                                                                                                                                                                                                                                                                    <h3>{service.name}</h3>
                                                                                                                                                                                                                                                                                                                                                                                                                                    <p>{service.desc}</p>
                                                                                                                                                                                                                                                                                                                                                                                                                                                  </button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                              ))}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </section>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <section className="booking">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  <h2>📋 Mau pergi ke mana?</h2>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <p>Isi perjalanan yang kamu inginkan</p>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      <form onSubmit={handleBooking}>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  <label>Lokasi penjemputan</label>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              <input
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            value={pickup}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          onChange={(e) => setPickup(e.target.value)}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        placeholder="Masukkan lokasi penjemputan"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    />
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <label>Lokasi tujuan</label>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <input
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          value={destination}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        onChange={(e) => setDestination(e.target.value)}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      placeholder="Mau diantar ke mana?"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  />
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              <button className="book-button" type="submit">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            Pesan Sekarang →
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  </form>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          </section>
<section className="order-history">
  <h2>Riwayat Pesanan</h2>
<button
  type="button"
  onClick={clearOrders}
  className="clear-orders-button"
>
  🗑️ Hapus Semua Riwayat
</button>
  {orders.length === 0 ? (
    <p>Belum ada pesanan.</p>
  ) : (
    orders.map((order) => (
      <div key={order.id} className="order-card">

        <div className="order-card-top">
          <div className="order-service">
            <span className="order-icon">
              {order.service === 'Ojek Motor' ? '🏍️' :
               order.service === 'Antar Mobil' ? '🚕' :
               order.service === 'Kirim Barang' ? '📦' : '📍'}
            </span>
            <h3>{order.service}</h3>
          </div>

          <span className="status-badge">
            {order.status || 'Menunggu'}
          </span>
        </div>

        <div className="order-route">
  <p>📅 Waktu pesan: {order.createdAt || '-'}</p>
  <p>📍 Jemput: {order.pickup}</p>
  <p>🏁 Tujuan: {order.destination}</p>
</div>
{order.status === 'Menunggu' && (
  <button
    type="button"
    className="cancel-order-button"
    onClick={() => cancelOrder(order.id)}
  >
    ❌ Batalkan Pesanan
  </button>
)}
      </div>
    ))
  )}
</section>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  <p className="trust-note">🛡️ AntarYuk Indonesia · Pesan Mudah, Perjalanan Nyaman.</p>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </main>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              <footer>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      © 2026 AntarYuk Indonesia
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              <p>Berawal dari Maluku Utara, menuju Indonesia.</p>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </footer>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          );
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         