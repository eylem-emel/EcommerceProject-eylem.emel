import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  addAddressThunk,
  deleteAddressThunk,
  fetchAddressesThunk,
  addCardThunk,
  deleteCardThunk,
  fetchCardsThunk,
  createOrderThunk,
} from "../store/order.thunks";

const TR_CITIES = [
  "adana",
  "adiyaman",
  "afyonkarahisar",
  "agri",
  "amasya",
  "ankara",
  "antalya",
  "artvin",
  "aydin",
  "balikesir",
  "bilecik",
  "bingol",
  "bitlis",
  "bolu",
  "burdur",
  "bursa",
  "canakkale",
  "cankiri",
  "corum",
  "denizli",
  "diyarbakir",
  "edirne",
  "elazig",
  "erzincan",
  "erzurum",
  "eskisehir",
  "gaziantep",
  "giresun",
  "gumushane",
  "hakkari",
  "hatay",
  "isparta",
  "mersin",
  "istanbul",
  "izmir",
  "kars",
  "kastamonu",
  "kayseri",
  "kirklareli",
  "kirsehir",
  "kocaeli",
  "konya",
  "kutahya",
  "malatya",
  "manisa",
  "kahramanmaras",
  "mardin",
  "mugla",
  "mus",
  "nevsehir",
  "nigde",
  "ordu",
  "rize",
  "sakarya",
  "samsun",
  "siirt",
  "sinop",
  "sivas",
  "tekirdag",
  "tokat",
  "trabzon",
  "tunceli",
  "sanliurfa",
  "usak",
  "van",
  "yozgat",
  "zonguldak",
];

const onlyDigits = (s) => String(s || "").replace(/\D/g, "");
const last4 = (s) => {
  const d = onlyDigits(s);
  return d.length >= 4 ? d.slice(-4) : d;
};
const getPrice = (p) => Number(p?.price) || 0;

const getProductId = (p) => p?.id ?? p?.product_id ?? p?.productId;
const getProductName = (p) => p?.name || p?.title || "Ürün";

export default function CreateOrderPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((s) => s.shoppingCart?.cart || []);
  const addresses = useSelector((s) => s.client?.addressList || []);
  const cards = useSelector((s) => s.client?.creditCards || []);

  const [step, setStep] = useState(1);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);

  const [ccv, setCcv] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  // yalnızca checked ürünler siparişe girer
  const selectedItems = useMemo(() => cart.filter((i) => i.checked), [cart]);

  const productsTotal = useMemo(() => {
    return selectedItems.reduce(
      (sum, i) => sum + getPrice(i.product) * (i.count || 0),
      0
    );
  }, [selectedItems]);

  // basit kargo/indirim mantığı (CartPage ile aynı)
  const shipping = selectedItems.length ? 29.99 : 0;
  const discount = productsTotal >= 150 && selectedItems.length ? 29.99 : 0;
  const grandTotal = productsTotal + shipping - discount;

  // --- forms ---
  const addressForm = useForm({
    defaultValues: {
      title: "",
      name: "",
      surname: "",
      phone: "",
      city: "istanbul",
      district: "",
      neighborhood: "",
    },
    mode: "onTouched",
  });

  const cardForm = useForm({
    defaultValues: {
      card_no: "",
      expire_month: "",
      expire_year: "",
      name_on_card: "",
    },
    mode: "onTouched",
  });

  // fetch lists
  useEffect(() => {
    dispatch(fetchAddressesThunk()).catch(() => {});
    dispatch(fetchCardsThunk()).catch(() => {});
  }, [dispatch]);

  // default selections
  useEffect(() => {
    if (!selectedAddressId && addresses.length) {
      setSelectedAddressId(addresses[0]?.id);
    }
  }, [addresses, selectedAddressId]);

  useEffect(() => {
    if (!selectedCardId && cards.length) {
      setSelectedCardId(cards[0]?.id);
    }
  }, [cards, selectedCardId]);

  // Guard: hiç seçili ürün yoksa kullanıcıyı uyarmak için
  useEffect(() => {
    if (cart.length && selectedItems.length === 0) {
      // sessiz uyarı: sadece checkout'ta anlamlı
      // toast.warn("Sipariş için sepetten ürün seçmelisin");
    }
  }, [cart.length, selectedItems.length]);

  // --- address handlers ---
  const onAddAddress = async (data) => {
    try {
      const payload = {
        title: String(data.title || "").trim(),
        name: String(data.name || "").trim(),
        surname: String(data.surname || "").trim(),
        phone: onlyDigits(data.phone),
        city: String(data.city || "").trim().toLowerCase(),
        district: String(data.district || "").trim(),
        neighborhood: String(data.neighborhood || "").trim(),
      };

      await dispatch(addAddressThunk(payload));
      toast.success("Adres kaydedildi");
      setShowAddressForm(false);
      addressForm.reset();
    } catch (e) {
      toast.error("Adres kaydedilemedi");
    }
  };

  const onDeleteAddress = async (id) => {
    try {
      await dispatch(deleteAddressThunk(id));
      toast.success("Adres silindi");
      if (selectedAddressId === id) setSelectedAddressId(null);
    } catch (e) {
      toast.error("Adres silinemedi");
    }
  };

  // --- card handlers ---
  const onAddCard = async (data) => {
    try {
      const payload = {
        card_no: onlyDigits(data.card_no),
        expire_month: Number(data.expire_month),
        expire_year: Number(data.expire_year),
        name_on_card: String(data.name_on_card || "").trim(),
      };
      await dispatch(addCardThunk(payload));
      toast.success("Kart kaydedildi");
      setShowCardForm(false);
      cardForm.reset();
    } catch (e) {
      toast.error("Kart kaydedilemedi");
    }
  };

  const onDeleteCard = async (id) => {
    try {
      await dispatch(deleteCardThunk(id));
      toast.success("Kart silindi");
      if (selectedCardId === id) setSelectedCardId(null);
    } catch (e) {
      toast.error("Kart silinemedi");
    }
  };

  const selectedCard = useMemo(() => {
    return cards.find((c) => c.id === selectedCardId) || null;
  }, [cards, selectedCardId]);

  const selectedAddress = useMemo(() => {
    return addresses.find((a) => a.id === selectedAddressId) || null;
  }, [addresses, selectedAddressId]);

  const goStep1 = () => setStep(1);

  const goStep2 = () => {
    if (selectedItems.length === 0) {
      toast.warn("Sipariş için sepetten ürün seçmelisin");
      return;
    }
    if (!selectedAddressId) {
      toast.warn("Teslimat adresi seçmelisin");
      return;
    }
    setStep(2);
  };

  const onCompleteOrder = async () => {
    if (selectedItems.length === 0) {
      toast.warn("Sipariş için sepetten ürün seçmelisin");
      return;
    }
    if (!selectedAddressId) {
      toast.warn("Teslimat adresi seçmelisin");
      setStep(1);
      return;
    }
    if (!selectedCardId || !selectedCard) {
      toast.warn("Kart seçmelisin");
      return;
    }
    const ccvDigits = onlyDigits(ccv);
    if (ccvDigits.length < 3) {
      toast.warn("CVV en az 3 haneli olmalı");
      return;
    }
    if (!acceptTerms) {
      toast.warn("Koşulları onaylamalısın");
      return;
    }

    const productsPayload = selectedItems.map((i) => ({
      product_id: getProductId(i.product),
      count: i.count || 1,
      detail: "", // istersen burada renk/beden vb. detay tutabilirsin
    }));

    const payload = {
      address_id: selectedAddressId,
      order_date: new Date().toISOString(),
      card_no: Number(onlyDigits(selectedCard.card_no || selectedCard.cardNumber || "")) || 0,
      card_name: selectedCard.name_on_card || selectedCard.card_name || "",
      card_expire_month: Number(selectedCard.expire_month || selectedCard.month) || 0,
      card_expire_year: Number(selectedCard.expire_year || selectedCard.year) || 0,
      card_ccv: Number(ccvDigits),
      price: Math.round(grandTotal * 100) / 100,
      products: productsPayload,
    };

    try {
      await dispatch(createOrderThunk(payload));
      toast.success("Tebrikler! Siparişin oluşturuldu 🎉");
      navigate("/orders");
    } catch (e) {
      toast.error("Sipariş oluşturulamadı");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Siparişi Tamamla</h1>
          <p className="text-sm text-gray-600 mt-1">
            Seçili ürün: {selectedItems.length} • Ürün toplamı:{" "}
            {productsTotal.toFixed(2)} TL
          </p>
        </div>
        <Link to="/cart" className="text-sm underline text-gray-700">
          Sepete dön
        </Link>
      </div>

      {/* Step tabs */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={goStep1}
              className={`flex-1 rounded-xl border px-4 py-3 text-left ${
                step === 1 ? "border-orange-500" : "border-gray-200"
              }`}
            >
              <div className="text-xs text-gray-500">1</div>
              <div className="font-semibold">Adres Bilgileri</div>
            </button>

            <button
              type="button"
              onClick={goStep2}
              className={`flex-1 rounded-xl border px-4 py-3 text-left ${
                step === 2 ? "border-orange-500" : "border-gray-200"
              }`}
            >
              <div className="text-xs text-gray-500">2</div>
              <div className="font-semibold">Ödeme Seçenekleri</div>
            </button>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="mt-4 rounded-2xl border bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold">Teslimat Adresi</div>
                <button
                  type="button"
                  onClick={() => setShowAddressForm((v) => !v)}
                  className="text-sm px-3 py-2 rounded-xl border"
                >
                  {showAddressForm ? "Kapat" : "Yeni Adres Ekle"}
                </button>
              </div>

              {/* address list */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {addresses.map((a) => (
                  <label
                    key={a.id}
                    className={`rounded-2xl border p-4 cursor-pointer ${
                      selectedAddressId === a.id
                        ? "border-orange-500 ring-1 ring-orange-200"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="addr"
                          checked={selectedAddressId === a.id}
                          onChange={() => setSelectedAddressId(a.id)}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-semibold">{a.title || "Adres"}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {a.name} {a.surname}
                          </div>
                          <div className="text-sm text-gray-600">
                            {a.phone}
                          </div>
                          <div className="text-sm text-gray-600 mt-2">
                            {a.neighborhood} • {a.district} / {a.city}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          onDeleteAddress(a.id);
                        }}
                        className="text-xs px-2 py-1 rounded-lg border text-gray-600 hover:text-black"
                      >
                        Sil
                      </button>
                    </div>
                  </label>
                ))}

                {addresses.length === 0 && (
                  <div className="text-sm text-gray-600">
                    Kayıtlı adresin yok. “Yeni Adres Ekle” ile ekleyebilirsin.
                  </div>
                )}
              </div>

              {/* address form */}
              {showAddressForm && (
                <div className="mt-4 rounded-2xl border p-4">
                  <div className="font-semibold mb-3">Yeni Adres</div>

                  <form
                    onSubmit={addressForm.handleSubmit(onAddAddress)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                  >
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-600">Adres Başlığı</label>
                      <input
                        className="mt-1 w-full border rounded-xl px-3 py-2"
                        placeholder="Ev adresi"
                        {...addressForm.register("title", {
                          required: "Zorunlu",
                          minLength: { value: 2, message: "En az 2 karakter" },
                        })}
                      />
                      {addressForm.formState.errors.title && (
                        <p className="text-xs text-red-500 mt-1">
                          {addressForm.formState.errors.title.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Ad</label>
                      <input
                        className="mt-1 w-full border rounded-xl px-3 py-2"
                        {...addressForm.register("name", {
                          required: "Zorunlu",
                          minLength: { value: 2, message: "En az 2 karakter" },
                        })}
                      />
                      {addressForm.formState.errors.name && (
                        <p className="text-xs text-red-500 mt-1">
                          {addressForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Soyad</label>
                      <input
                        className="mt-1 w-full border rounded-xl px-3 py-2"
                        {...addressForm.register("surname", {
                          required: "Zorunlu",
                          minLength: { value: 2, message: "En az 2 karakter" },
                        })}
                      />
                      {addressForm.formState.errors.surname && (
                        <p className="text-xs text-red-500 mt-1">
                          {addressForm.formState.errors.surname.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Telefon</label>
                      <input
                        className="mt-1 w-full border rounded-xl px-3 py-2"
                        placeholder="05xxxxxxxxx"
                        {...addressForm.register("phone", {
                          required: "Zorunlu",
                          validate: (v) =>
                            onlyDigits(v).length >= 10 || "Telefon geçersiz",
                        })}
                      />
                      {addressForm.formState.errors.phone && (
                        <p className="text-xs text-red-500 mt-1">
                          {addressForm.formState.errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">İl</label>
                      <select
                        className="mt-1 w-full border rounded-xl px-3 py-2"
                        {...addressForm.register("city", { required: "Zorunlu" })}
                      >
                        {TR_CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">İlçe</label>
                      <input
                        className="mt-1 w-full border rounded-xl px-3 py-2"
                        {...addressForm.register("district", {
                          required: "Zorunlu",
                          minLength: { value: 2, message: "En az 2 karakter" },
                        })}
                      />
                      {addressForm.formState.errors.district && (
                        <p className="text-xs text-red-500 mt-1">
                          {addressForm.formState.errors.district.message}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-600">Mahalle / Adres Detay</label>
                      <textarea
                        rows={3}
                        className="mt-1 w-full border rounded-xl px-3 py-2"
                        {...addressForm.register("neighborhood", {
                          required: "Zorunlu",
                          minLength: { value: 3, message: "En az 3 karakter" },
                        })}
                      />
                      {addressForm.formState.errors.neighborhood && (
                        <p className="text-xs text-red-500 mt-1">
                          {addressForm.formState.errors.neighborhood.message}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl border"
                        onClick={() => {
                          setShowAddressForm(false);
                          addressForm.reset();
                        }}
                      >
                        Vazgeç
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-orange-500 text-white font-semibold"
                      >
                        Kaydet
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="mt-5 flex items-center justify-end">
                <button
                  type="button"
                  onClick={goStep2}
                  className="px-5 py-3 rounded-xl bg-orange-500 text-white font-semibold disabled:opacity-50"
                  disabled={!selectedAddressId || selectedItems.length === 0}
                >
                  Kaydet ve Devam Et
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 (başlangıç) */}
          {step === 2 && (
            <div className="mt-4 rounded-2xl border bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold">Kart Bilgileri</div>
                <button
                  type="button"
                  onClick={() => setShowCardForm((v) => !v)}
                  className="text-sm px-3 py-2 rounded-xl border"
                >
                  {showCardForm ? "Kapat" : "Yeni Kart Ekle"}
                </button>
              </div>

              {/* cards list */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {cards.map((c) => (
                  <label
                    key={c.id}
                    className={`rounded-2xl border p-4 cursor-pointer ${
                      selectedCardId === c.id
                        ? "border-orange-500 ring-1 ring-orange-200"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="card"
                          checked={selectedCardId === c.id}
                          onChange={() => setSelectedCardId(c.id)}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-semibold">
                            **** **** **** {last4(c.card_no)}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {c.name_on_card}
                          </div>
                          <div className="text-sm text-gray-600">
                            Son Kullanma: {c.expire_month}/{c.expire_year}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          onDeleteCard(c.id);
                        }}
                        className="text-xs px-2 py-1 rounded-lg border text-gray-600 hover:text-black"
                      >
                        Sil
                      </button>
                    </div>
                  </label>
                ))}

                {cards.length === 0 && (
                  <div className="text-sm text-gray-600">
                    Kayıtlı kartın yok. “Yeni Kart Ekle” ile ekleyebilirsin.
                  </div>
                )}
              </div>

              {/* card form */}
              {showCardForm && (
                <div className="mt-4 rounded-2xl border p-4">
                  <div className="font-semibold mb-3">Yeni Kart</div>

                  <form
                    onSubmit={cardForm.handleSubmit(onAddCard)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                  >
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-600">Kart Numarası</label>
                      <input
                        className="mt-1 w-full border rounded-xl px-3 py-2"
                        placeholder="1234 1234 1234 1234"
                        {...cardForm.register("card_no", {
                          required: "Zorunlu",
                          validate: (v) =>
                            onlyDigits(v).length >= 12 || "Kart no geçersiz",
                        })}
                      />
                      {cardForm.formState.errors.card_no && (
                        <p className="text-xs text-red-500 mt-1">
                          {cardForm.formState.errors.card_no.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Ay</label>
                      <input
                        className="mt-1 w-full border rounded-xl px-3 py-2"
                        placeholder="12"
                        {...cardForm.register("expire_month", {
                          required: "Zorunlu",
                          validate: (v) => {
                            const n = Number(v);
                            return (n >= 1 && n <= 12) || "Ay 1-12 olmalı";
                          },
                        })}
                      />
                      {cardForm.formState.errors.expire_month && (
                        <p className="text-xs text-red-500 mt-1">
                          {cardForm.formState.errors.expire_month.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Yıl</label>
                      <input
                        className="mt-1 w-full border rounded-xl px-3 py-2"
                        placeholder="2028"
                        {...cardForm.register("expire_year", {
                          required: "Zorunlu",
                          validate: (v) => {
                            const n = Number(v);
                            return (n >= 2024 && n <= 2050) || "Yıl geçersiz";
                          },
                        })}
                      />
                      {cardForm.formState.errors.expire_year && (
                        <p className="text-xs text-red-500 mt-1">
                          {cardForm.formState.errors.expire_year.message}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-600">Kart Üzerindeki İsim</label>
                      <input
                        className="mt-1 w-full border rounded-xl px-3 py-2"
                        placeholder="Ali Baş"
                        {...cardForm.register("name_on_card", {
                          required: "Zorunlu",
                          minLength: { value: 2, message: "En az 2 karakter" },
                        })}
                      />
                      {cardForm.formState.errors.name_on_card && (
                        <p className="text-xs text-red-500 mt-1">
                          {cardForm.formState.errors.name_on_card.message}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl border"
                        onClick={() => {
                          setShowCardForm(false);
                          cardForm.reset();
                        }}
                      >
                        Vazgeç
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-orange-500 text-white font-semibold"
                      >
                        Kaydet
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="mt-4 rounded-2xl border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold">CVV</div>
                  <div className="text-xs text-gray-500">Kartın arkasındaki 3 hane</div>
                </div>
                <input
                  value={ccv}
                  onChange={(e) => setCcv(onlyDigits(e.target.value).slice(0, 4))}
                  className="mt-2 w-full border rounded-xl px-3 py-2"
                  placeholder="123"
                />

                <label className="mt-4 flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-4 h-4"
                  />
                  Ön bilgilendirme koşullarını ve mesafeli satış sözleşmesini okudum, onaylıyorum.
                </label>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl border font-semibold"
                >
                  Geri
                </button>

                <button
                  type="button"
                  onClick={onCompleteOrder}
                  className="px-5 py-3 rounded-xl bg-orange-500 text-white font-semibold disabled:opacity-50"
                  disabled={
                    !selectedCardId ||
                    !selectedCard ||
                    onlyDigits(ccv).length < 3 ||
                    !acceptTerms ||
                    selectedItems.length === 0
                  }
                >
                  Ödeme Yap
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SUMMARY */}
        <aside className="w-full lg:w-[360px]">
          <div className="sticky top-6 rounded-2xl border bg-white p-4">
            <div className="font-semibold">Sipariş Özeti</div>

            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Ürünlerin Toplamı</span>
                <span>{productsTotal.toFixed(2)} TL</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Kargo Toplam</span>
                <span>{shipping.toFixed(2)} TL</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">150 TL ve Üzeri Kargo Bedava</span>
                <span className="text-orange-500">-{discount.toFixed(2)} TL</span>
              </div>

              <div className="h-px bg-gray-200 my-2" />

              <div className="flex justify-between font-semibold">
                <span>Toplam</span>
                <span className="text-orange-500">{grandTotal.toFixed(2)} TL</span>
              </div>
            </div>

            <div className="mt-4 rounded-xl border p-3 text-xs text-gray-600">
              <div className="font-semibold text-gray-700">Seçimler</div>
              <div className="mt-2">
                <span className="text-gray-500">Adres:</span>{" "}
                {selectedAddress ? (
                  <span className="font-medium">
                    {selectedAddress.title} ({selectedAddress.city})
                  </span>
                ) : (
                  <span className="text-gray-400">Seçilmedi</span>
                )}
              </div>
              <div className="mt-1">
                <span className="text-gray-500">Kart:</span>{" "}
                {selectedCard ? (
                  <span className="font-medium">
                    **** {last4(selectedCard.card_no)}
                  </span>
                ) : (
                  <span className="text-gray-400">Seçilmedi</span>
                )}
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs text-gray-500 mb-2">
                Siparişe dahil edilecek ürünler
              </div>

              <div className="max-h-56 overflow-auto pr-1 space-y-2">
                {selectedItems.map((i) => (
                  <div
                    key={getProductId(i.product)}
                    className="rounded-xl border p-3 text-sm"
                  >
                    <div className="font-medium line-clamp-1">
                      {getProductName(i.product)}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Adet: {i.count} •{" "}
                      {(getPrice(i.product) * (i.count || 0)).toFixed(2)} TL
                    </div>
                  </div>
                ))}

                {selectedItems.length === 0 && (
                  <div className="text-sm text-gray-500">
                    Sepetten ürün seçmelisin.
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
