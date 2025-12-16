import { setRoles } from "./client.actions";

/**
 * Need-based thunk:
 * - roles store'da doluysa tekrar fetch etmez
 * - sadece gerektiğinde çağırırsın (ör: signup, login, admin sayfası)
 */
export const fetchRolesIfNeeded = () => async (dispatch, getState) => {
  const { roles } = getState().client;

  if (Array.isArray(roles) && roles.length > 0) {
    return; // already have roles
  }

  try {
    // Şimdilik endpoint'i varsayımsal yazıyorum.
    // Backend'inizde roles endpoint'i neyse burayı güncellersin.
    const res = await fetch("/roles");

    if (!res.ok) throw new Error(`Failed to fetch roles: ${res.status}`);

    const data = await res.json();

    // API bazen { roles: [...] } bazen direkt [...] döndürebilir diye güvenli okuyoruz
    const rolesList = Array.isArray(data) ? data : data?.roles;

    dispatch(setRoles(Array.isArray(rolesList) ? rolesList : []));
  } catch (err) {
    console.error("fetchRolesIfNeeded error:", err);
    // İstersen burada başka action ile hata state'i de tutabiliriz ama task bunu istemiyor.
  }
};
