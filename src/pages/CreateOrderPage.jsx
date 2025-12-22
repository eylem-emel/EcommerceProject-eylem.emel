import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  fetchAddressListThunk,
  addAddressThunk,
  updateAddressThunk,
  deleteAddressThunk,
  fetchCardListThunk,
  addCardThunk,
  updateCardThunk,
  deleteCardThunk,
  createOrderThunk,
} from "../store/order.thunks";

import { setAddress, setPayment } from "../store/shoppingCart.actions";

export default function CreateOrderPage() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.client?.user);
  const cart = useSelector((state) => state.shoppingCart?.cart || []);

  const addressList = useSelector((state) => state.client?.addressList || []);
  const creditCards = useSelector((state) => state.client?.creditCards || []);

  const selectedAddress = useSelector((state) => state.shoppingCart?.address || {});
  const selectedPayment = useSelector((state) => state.shoppingCart?.payment || {});

  const [step, setStep] = useState(1);

  // Form görünürlükleri
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);

  // ✅ EDIT STATE (Task T20/T21 update için)
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [editingCardId, setEditingCardId] = useState(null);

  // Address form
  const {
    register: registerAddress,
    handleSubmit: handleSubmitAddress,
    reset: resetAddress,
    formState: { errors: addressErrors },
  } = useForm({
    defaultValues: {
      title: "",
      name: "",
      surname: "",
      phone: "",
      city: "",
      district: "",
      neighborhood: "",
    },
  });

  // Card form
  const {
    register: registerCard,
    handleSubmit: handleSubmitCard,
    reset: resetCard,
    formState: { errors: cardErrors },
  } = useForm({
    defaultValues: {
      card_no: "",
      expire_month: "",
      expire_year: "",
      name_on_card: "",
    },
  });

  const checkedCartItems = useMemo(
    () => cart.filter((i) => i?.checked !== false),
    [cart]
  );

  const cartTotal = useMemo(() => {
    return checkedCartItems.reduce(
      (acc, item) => acc + (item?.count || 0) * (item?.product?.price || 0),
      0
    );
  }, [checkedCartItems]);

  // Protected routing: login yoksa login sayfasına gönder
  if (!user) {
    return <Redirect to="/login" />;
  }

  useEffect(() => {
    // Task T20/T21: sayfa açılınca adres & kartları çek
    dispatch(fetchAddressListThunk());
    dispatch(fetchCardListThunk());
  }, [dispatch]);

  // ---------- ADDRESS ----------
  const onSelectAddress = (addr) => {
    dispatch(setAddress(addr)); // ✅ Task T09 uyumu
  };

  const onClickAddAddress = () => {
    setEditingAddressId(null);
    resetAddress({
      title: "",
      name: "",
      surname: "",
      phone: "",
      city: "",
      district: "",
      neighborhood: "",
    });
    setShowAddressForm(true);
  };

  const onClickEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    resetAddress({
      title: addr.title || "",
      name: addr.name || "",
      surname: addr.surname || "",
      phone: addr.phone || "",
      city: addr.city || "",
      district: addr.district || "",
      neighborhood: addr.neighborhood || "",
    });
    setShowAddressForm(true);
  };

  const onSubmitAddress = async (data) => {
    try {
      if (editingAddressId) {
        await dispatch(updateAddressThunk({ ...data, id: editingAddressId }));
        toast.success("Adres güncellendi");
      } else {
        await dispatch(addAddressThunk(data));
        toast.success("Adres eklendi");
      }

      await dispatch(fetchAddressListThunk());

      setEditingAddressId(null);
      setShowAddressForm(false);
      resetAddress({
        title: "",
        name: "",
        surname: "",
        phone: "",
        city: "",
        district: "",
        neighborhood: "",
      });
    } catch (e) {
      toast.error("Adres kaydedilemedi");
    }
  };

  const onDeleteAddress = async (addressId) => {
    try {
      await dispatch(deleteAddressThunk(addressId));
      toast.success("Adres silindi");
      await dispatch(fetchAddressListThunk());

      if (selectedAddress?.id === addressId) {
        dispatch(setAddress({}));
      }
    } catch (e) {
      toast.error("Adres silinemedi");
    }
  };

  // ---------- CARD ----------
  const onSelectCard = (card) => {
    dispatch(setPayment(card)); // ✅ Task T09 uyumu
  };

  const onClickAddCard = () => {
    setEditingCardId(null);
    resetCard({
      card_no: "",
      expire_month: "",
      expire_year: "",
      name_on_card: "",
    });
    setShowCardForm(true);
  };

  const onClickEditCard = (card) => {
    setEditingCardId(card.id);
    resetCard({
      card_no: card.card_no || "",
      expire_month: card.expire_month || "",
      expire_year: card.expire_year || "",
      name_on_card: card.name_on_card || "",
    });
    setShowCardForm(true);
  };

  const onSubmitCard = async (data) => {
    try {
      const payload = {
        ...data,
        expire_month: Number(data.expire_month),
        expire_year: Number(data.expire_year),
      };

      if (editingCardId) {
        await dispatch(updateCardThunk({ ...payload, id: editingCardId }));
        toast.success("Kart güncellendi");
      } else {
        await dispatch(addCardThunk(payload));
        toast.success("Kart eklendi");
      }

      await dispatch(fetchCardListThunk());

      setEditingCardId(null);
      setShowCardForm(false);
      resetCard({
        card_no: "",
        expire_month: "",
        expire_year: "",
        name_on_card: "",
      });
    } catch (e) {
      toast.error("Kart kaydedilemedi");
    }
  };

  const onDeleteCard = async (cardId) => {
    try {
      await dispatch(deleteCardThunk(cardId));
      toast.success("Kart silindi");
      await dispatch(fetchCardListThunk());

      if (selectedPayment?.id === cardId) {
        dispatch(setPayment({}));
      }
    } catch (e) {
      toast.error("Kart silinemedi");
    }
  };

  // ---------- ORDER ----------
  const handleCreateOrder = async () => {
    if (!checkedCartItems.length) {
      toast.warn("Sepette seçili ürün yok.");
      return;
    }
    if (!selectedAddress?.id) {
      toast.warn("Lütfen bir adres seçin.");
      setStep(1);
      return;
    }
    if (!selectedPayment?.card_no) {
      toast.warn("Lütfen bir kart seçin.");
      setStep(2);
      return;
    }

    // Task T22 payload formatına uygun
    const payload = {
      address_id: selectedAddress.id,
      order_date: new Date().toISOString(),
      card_no: Number(selectedPayment.card_no),
      card_name: selectedPayment.name_on_card,
      card_expire_month: Number(selectedPayment.expire_month),
      card_expire_year: Number(selectedPayment.expire_year),
      card_ccv: 321, // demo
      price: Math.round(cartTotal),
      products: checkedCartItems.map((item) => ({
        product_id: item.product.id,
        count: item.count,
        detail: "default",
      })),
    };

    try {
      await dispatch(createOrderThunk(payload));
      toast.success("Tebrikler! Siparişiniz oluşturuldu 🎉");
      // createOrderThunk içinde cart resetlediğini varsayıyorum
    } catch (e) {
      toast.error("Sipariş oluşturulamadı");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Siparişi Tamamla</h1>

        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-xl border ${
              step === 1 ? "bg-gray-900 text-white" : "bg-white"
            }`}
            onClick={() => setStep(1)}
          >
            1) Adres
          </button>
          <button
            className={`px-4 py-2 rounded-xl border ${
              step === 2 ? "bg-gray-900 text-white" : "bg-white"
            }`}
            onClick={() => setStep(2)}
          >
            2) Kart
          </button>
        </div>
      </div>

      {/* Özet */}
      <div className="mb-6 p-4 rounded-2xl border bg-white">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">Seçili ürün toplamı</div>
          <div className="font-semibold">{cartTotal.toFixed(2)} ₺</div>
        </div>
      </div>

      {/* STEP 1: ADDRESS */}
      {step === 1 && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Address List */}
          <div className="p-4 rounded-2xl border bg-white">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold">Adresler</div>
              <button
                className="px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600"
                onClick={onClickAddAddress}
              >
                + Adres Ekle
              </button>
            </div>

            {addressList.length === 0 ? (
              <div className="text-sm text-gray-500">Kayıtlı adres yok.</div>
            ) : (
              <div className="space-y-3">
                {addressList.map((addr) => {
                  const active = selectedAddress?.id === addr.id;
                  return (
                    <div
                      key={addr.id}
                      className={`p-3 rounded-xl border ${
                        active ? "border-orange-500" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <button
                          type="button"
                          className="text-left flex-1"
                          onClick={() => onSelectAddress(addr)}
                        >
                          <div className="font-semibold">{addr.title}</div>
                          <div className="text-sm text-gray-600">
                            {addr.name} {addr.surname} • {addr.phone}
                          </div>
                          <div className="text-sm text-gray-600">
                            {addr.city} / {addr.district} • {addr.neighborhood}
                          </div>
                        </button>

                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1 rounded-lg border hover:bg-gray-50"
                            onClick={() => onClickEditAddress(addr)}
                          >
                            Düzenle
                          </button>
                          <button
                            className="px-3 py-1 rounded-lg border text-red-600 hover:bg-red-50"
                            onClick={() => onDeleteAddress(addr.id)}
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Address Form */}
          <div className="p-4 rounded-2xl border bg-white">
            <div className="font-semibold mb-4">
              {editingAddressId ? "Adres Güncelle" : "Yeni Adres"}
            </div>

            {!showAddressForm ? (
              <div className="text-sm text-gray-500">
                Adres eklemek/düzenlemek için soldan butonları kullan.
              </div>
            ) : (
              <form
                className="grid grid-cols-1 gap-3"
                onSubmit={handleSubmitAddress(onSubmitAddress)}
              >
                <input
                  className="border rounded-xl px-3 py-2"
                  placeholder="Adres Başlığı"
                  {...registerAddress("title", { required: true })}
                />
                {addressErrors.title && (
                  <div className="text-xs text-red-600">Zorunlu alan</div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      className="border rounded-xl px-3 py-2 w-full"
                      placeholder="Ad"
                      {...registerAddress("name", { required: true })}
                    />
                    {addressErrors.name && (
                      <div className="text-xs text-red-600">Zorunlu alan</div>
                    )}
                  </div>
                  <div>
                    <input
                      className="border rounded-xl px-3 py-2 w-full"
                      placeholder="Soyad"
                      {...registerAddress("surname", { required: true })}
                    />
                    {addressErrors.surname && (
                      <div className="text-xs text-red-600">Zorunlu alan</div>
                    )}
                  </div>
                </div>

                <input
                  className="border rounded-xl px-3 py-2"
                  placeholder="Telefon"
                  {...registerAddress("phone", { required: true })}
                />
                {addressErrors.phone && (
                  <div className="text-xs text-red-600">Zorunlu alan</div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <input
                    className="border rounded-xl px-3 py-2"
                    placeholder="İl"
                    {...registerAddress("city", { required: true })}
                  />
                  <input
                    className="border rounded-xl px-3 py-2"
                    placeholder="İlçe"
                    {...registerAddress("district", { required: true })}
                  />
                </div>

                <textarea
                  className="border rounded-xl px-3 py-2"
                  placeholder="Mahalle / Adres Detayı"
                  rows={3}
                  {...registerAddress("neighborhood", { required: true })}
                />
                {addressErrors.neighborhood && (
                  <div className="text-xs text-red-600">Zorunlu alan</div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600"
                  >
                    {editingAddressId ? "Güncelle" : "Kaydet"}
                  </button>

                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl border hover:bg-gray-50"
                    onClick={() => {
                      setEditingAddressId(null);
                      setShowAddressForm(false);
                      resetAddress({
                        title: "",
                        name: "",
                        surname: "",
                        phone: "",
                        city: "",
                        district: "",
                        neighborhood: "",
                      });
                    }}
                  >
                    İptal
                  </button>

                  <button
                    type="button"
                    className="ml-auto px-4 py-2 rounded-xl bg-gray-900 text-white"
                    onClick={() => setStep(2)}
                  >
                    Devam →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* STEP 2: CARD */}
      {step === 2 && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card List */}
          <div className="p-4 rounded-2xl border bg-white">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold">Kartlar</div>
              <button
                className="px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600"
                onClick={onClickAddCard}
              >
                + Kart Ekle
              </button>
            </div>

            {creditCards.length === 0 ? (
              <div className="text-sm text-gray-500">Kayıtlı kart yok.</div>
            ) : (
              <div className="space-y-3">
                {creditCards.map((card) => {
                  const active = selectedPayment?.id === card.id;
                  const masked =
                    typeof card.card_no === "string"
                      ? card.card_no.replace(/\d(?=\d{4})/g, "*")
                      : String(card.card_no || "").replace(/\d(?=\d{4})/g, "*");

                  return (
                    <div
                      key={card.id}
                      className={`p-3 rounded-xl border ${
                        active ? "border-orange-500" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <button
                          type="button"
                          className="text-left flex-1"
                          onClick={() => onSelectCard(card)}
                        >
                          <div className="font-semibold">{card.name_on_card}</div>
                          <div className="text-sm text-gray-600">{masked}</div>
                          <div className="text-sm text-gray-600">
                            SKT: {card.expire_month}/{card.expire_year}
                          </div>
                        </button>

                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1 rounded-lg border hover:bg-gray-50"
                            onClick={() => onClickEditCard(card)}
                          >
                            Düzenle
                          </button>
                          <button
                            className="px-3 py-1 rounded-lg border text-red-600 hover:bg-red-50"
                            onClick={() => onDeleteCard(card.id)}
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Card Form */}
          <div className="p-4 rounded-2xl border bg-white">
            <div className="font-semibold mb-4">
              {editingCardId ? "Kart Güncelle" : "Yeni Kart"}
            </div>

            {!showCardForm ? (
              <div className="text-sm text-gray-500">
                Kart eklemek/düzenlemek için soldan butonları kullan.
              </div>
            ) : (
              <form className="grid gap-3" onSubmit={handleSubmitCard(onSubmitCard)}>
                <input
                  className="border rounded-xl px-3 py-2"
                  placeholder="Kart Numarası"
                  {...registerCard("card_no", {
                    required: true,
                    minLength: 16,
                    maxLength: 16,
                  })}
                />
                {cardErrors.card_no && (
                  <div className="text-xs text-red-600">
                    Kart numarası 16 haneli olmalı
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <input
                    className="border rounded-xl px-3 py-2"
                    placeholder="Ay (12)"
                    {...registerCard("expire_month", {
                      required: true,
                      min: 1,
                      max: 12,
                    })}
                  />
                  <input
                    className="border rounded-xl px-3 py-2"
                    placeholder="Yıl (2027)"
                    {...registerCard("expire_year", {
                      required: true,
                      min: 2024,
                    })}
                  />
                </div>

                <input
                  className="border rounded-xl px-3 py-2"
                  placeholder="Kart Üzerindeki İsim"
                  {...registerCard("name_on_card", { required: true })}
                />
                {cardErrors.name_on_card && (
                  <div className="text-xs text-red-600">Zorunlu alan</div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600"
                  >
                    {editingCardId ? "Güncelle" : "Kaydet"}
                  </button>

                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl border hover:bg-gray-50"
                    onClick={() => {
                      setEditingCardId(null);
                      setShowCardForm(false);
                      resetCard({
                        card_no: "",
                        expire_month: "",
                        expire_year: "",
                        name_on_card: "",
                      });
                    }}
                  >
                    İptal
                  </button>

                  <button
                    type="button"
                    className="ml-auto px-4 py-2 rounded-xl bg-gray-900 text-white"
                    onClick={handleCreateOrder}
                  >
                    Siparişi Oluştur
                  </button>
                </div>

                <button
                  type="button"
                  className="text-sm text-gray-600 underline mt-2"
                  onClick={() => setStep(1)}
                >
                  ← Adrese geri dön
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
