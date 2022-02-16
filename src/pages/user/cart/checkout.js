import { getAllProvince, getDistrict, getWard } from "../../../api/location";
import CartNav from "../../../components/user/cartNav";
import Footer from "../../../components/user/footer";
import Header from "../../../components/user/header";
import { formatCurrency, getUser } from "../../../utils";
import { getTotalPrice, totalPriceDerease } from "../../../utils/cart";

const CheckoutPage = {
    async render() {
        const userLogged = getUser();
        const { data: listProvince } = await getAllProvince();

        let listDistrict;
        let listWard;
        if (userLogged && userLogged.provinceCode) {
            listDistrict = await getDistrict(userLogged.provinceCode);
            listWard = await getWard(userLogged.districtCode);
        }

        const cartList = JSON.parse(localStorage.getItem("cart")) || [];
        const voucherList = JSON.parse(localStorage.getItem("voucher")) || [];

        // tổng tiền giảm bởi voucher
        const totalPriceVoucher = totalPriceDerease();

        return /* html */ `
        ${await Header.render()}

        <!-- content -->
        <main>
            <section class="container max-w-6xl mx-auto px-3 mt-10">
                ${CartNav.render("checkout")}
            </section>

            <form action="" id="cart__checkout-form" method="POST" class="container max-w-6xl mx-auto px-3 mt-10 mb-9 grid grid-cols-12 gap-5">
                <div class="col-span-12 lg:col-span-8 border-t-2 pt-3">
                    <h3 class="uppercase text-gray-500 font-semibold mb-2 text-lg">Thông tin thanh toán</h3>
                    
                    <div class="grid grid-cols-12 gap-x-4">
                        <div class="col-span-6 mb-3">
                            <label for="cart__checkout-form-name" class="font-semibold mb-1 block">Họ và tên *</label>
                            <input type="text" id="cart__checkout-form-name" value="${userLogged ? userLogged.fullName : ""}" class="shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-none focus:shadow-[0_0_5px_#ccc] w-full border px-2 h-10 text-sm outline-none" placeholder="Nhập họ tên">
                            <div class="text-sm mt-0.5 text-red-500"></div>
                        </div>
                        <div class="col-span-6 mb-3">
                            <label for="cart__checkout-form-phone" class="font-semibold mb-1 block">Điện thoại *</label>
                            <input type="text" id="cart__checkout-form-phone" value="${userLogged ? userLogged.phone : ""}" class="shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-none focus:shadow-[0_0_5px_#ccc] w-full border px-2 h-10 text-sm outline-none" placeholder="Số điện thoại người nhận hàng">
                            <div class="text-sm mt-0.5 text-red-500"></div>
                        </div>
                        <div class="col-span-12 mb-3">
                            <label for="cart__checkout-form-email" class="font-semibold mb-1 block">Email *</label>
                            <input type="email" id="cart__checkout-form-email" value="${userLogged ? userLogged.email : ""}" class="shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-none focus:shadow-[0_0_5px_#ccc] w-full border px-2 h-10 text-sm outline-none" placeholder="Email người nhận hàng">
                            <div class="text-sm mt-0.5 text-red-500"></div>
                        </div>
                        
                        ${userLogged && userLogged.provinceCode ? /* html */`
                        <div class="col-span-12 md:col-span-4 mb-3 relative">
                            <label for="cart__checkout-province" class="font-semibold mb-1 block">Tỉnh/Thành phố *</label>
                            <select id="cart__checkout-province" class="shadow-[inset_0_-1.4em_1em_0_rgba(0,0,0,0.02)] hover:shadow-none hover:cursor-default focus:shadow-none focus:cursor-text w-full border px-2 h-10 text-sm outline-none">
                                <option value="">-- Chọn Tỉnh/TP --</option>
                                ${listProvince.map((item) => `<option value="${item.code}" ${userLogged.provinceCode === item.code ? "selected" : ""}>${item.name}</option>`).join("")}
                            </select>
                            <div class="text-sm mt-0.5 text-red-500"></div>
                        </div>
                        <div class="col-span-12 md:col-span-4 mb-3 relative">
                            <label for="cart__checkout-district" class="font-semibold mb-1 block">Quận/Huyện *</label>
                            <select id="cart__checkout-district" class="shadow-[inset_0_-1.4em_1em_0_rgba(0,0,0,0.02)] hover:shadow-none hover:cursor-default focus:shadow-none focus:cursor-text w-full border px-2 h-10 text-sm outline-none">
                                <option value="">-- Chọn Quận/Huyện --</option>
                                ${listDistrict.map((item) => `<option value="${item.code}" ${userLogged.districtCode === item.code ? "selected" : ""}>${item.name}</option>`).join("")}
                            </select>
                            <div class="text-sm mt-0.5 text-red-500"></div>
                        </div>
                        <div class="col-span-12 md:col-span-4 mb-3 relative">
                            <label for="cart__checkout-ward" class="font-semibold mb-1 block">Xã/Phường *</label>
                            <select id="cart__checkout-ward" class="shadow-[inset_0_-1.4em_1em_0_rgba(0,0,0,0.02)] hover:shadow-none hover:cursor-default focus:shadow-none focus:cursor-text w-full border px-2 h-10 text-sm outline-none">
                                <option value="">-- Chọn Xã/Phường --</option>
                                ${listWard.map((item) => `<option value="${item.code}" ${userLogged.wardsCode === item.code ? "selected" : ""}>${item.name}</option>`).join("")}
                            </select>
                            <div class="text-sm mt-0.5 text-red-500"></div>
                        </div>
                        ` : /* html */`
                        <div class="col-span-12 md:col-span-4 mb-3 relative">
                            <label for="cart__checkout-province" class="font-semibold mb-1 block">Tỉnh/Thành phố *</label>
                            <select id="cart__checkout-province" class="shadow-[inset_0_-1.4em_1em_0_rgba(0,0,0,0.02)] hover:shadow-none hover:cursor-default focus:shadow-none focus:cursor-text w-full border px-2 h-10 text-sm outline-none">
                                <option value="">-- Chọn Tỉnh/TP --</option>
                                ${listProvince.map((item) => `<option value="${item.code}">${item.name}</option>`).join("")}
                            </select>
                            <div class="text-sm mt-0.5 text-red-500"></div>
                        </div>
                        <div class="col-span-12 md:col-span-4 mb-3 relative">
                            <label for="cart__checkout-district" class="font-semibold mb-1 block">Quận/Huyện *</label>
                            <select id="cart__checkout-district" class="shadow-[inset_0_-1.4em_1em_0_rgba(0,0,0,0.02)] hover:shadow-none hover:cursor-default focus:shadow-none focus:cursor-text w-full border px-2 h-10 text-sm outline-none">
                                <option value="">-- Chọn Quận/Huyện --</option>
                            </select>
                            <div class="text-sm mt-0.5 text-red-500"></div>
                        </div>
                        <div class="col-span-12 md:col-span-4 mb-3 relative">
                            <label for="cart__checkout-ward" class="font-semibold mb-1 block">Xã/Phường *</label>
                            <select id="cart__checkout-ward" class="shadow-[inset_0_-1.4em_1em_0_rgba(0,0,0,0.02)] hover:shadow-none hover:cursor-default focus:shadow-none focus:cursor-text w-full border px-2 h-10 text-sm outline-none">
                                <option value="">-- Chọn Xã/Phường --</option>
                            </select>
                            <div class="text-sm mt-0.5 text-red-500"></div>
                        </div>
                        `}

                        <div class="col-span-12 mb-3">
                            <label for="cart__checkout-form-add" class="font-semibold mb-1 block">Địa chỉ cụ thể *</label>
                            <input type="text" id="cart__checkout-form-add" value="${userLogged ? userLogged.address : ""}" class="shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-none focus:shadow-[0_0_5px_#ccc] w-full border px-2 h-10 text-sm outline-none" placeholder="VD: Số xx, Ngõ xx, Phú Kiều">
                            <div class="text-sm mt-0.5 text-red-500"></div>
                        </div>
                    </div>

                    <h3 class="uppercase text-gray-500 font-semibold my-2 text-lg">Thông tin bổ sung</h3>
                    <div class="grid grid-cols-12">
                        <div class="col-span-12 mb-3">
                            <label for="" class="font-semibold mb-1 block">Ghi chú đơn hàng (tuỳ chọn)</label>
                            <textarea name="" id="" cols="30" rows="5" class="shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-none focus:shadow-[0_0_5px_#ccc] w-full border p-2 text-sm outline-none" placeholder="Ghi chú về đơn hàng"></textarea>
                        </div>
                    </div>
                </div>

                <div class="col-span-12 lg:col-span-4 border-l p-4 border-2 border-[#D9A953] min-h-40">
                    <h3 class="uppercase text-gray-500 font-semibold mb-3 text-lg">Đơn hàng của bạn</h3>

                    <table class="w-full text-left">
                        <thead>
                            <tr>
                                <th class="uppercase text-gray-500 text-sm pb-1.5 border-b-2">Sản phẩm</th>
                                <th class="uppercase text-gray-500 text-sm pb-1.5 border-b-2 text-right">Tổng</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${cartList.map((item) => /* html */`
                                <tr class="border-b">
                                    <td class="text-sm leading-5 py-3 text-gray-500 pr-1">
                                        <p class="text-base">
                                            <span>${item.productName}</span>
                                            <strong>x ${item.quantity}</strong>
                                        </p>
                                        <p class="uppercase">Đá: ${item.ice}%</p>
                                        <p class="uppercase">Đường: ${item.sugar}%</p>
                                        <p class="uppercase">Size:  ${item.sizeName}</p>
                                        <p class="uppercase">Topping: ${item.toppingId ? item.toppingName : "Không chọn Topping"}</p>
                                    </td>

                                    <td class="py-3 font-semibold text-right pl-1">${formatCurrency((item.productPrice + item.sizePrice + item.toppingPrice) * item.quantity)}</td>
                                </tr>
                                `).join("")}
                        </tbody>

                        <tfoot>
                            <tr class="border-b">
                                <td class="font-semibold text-sm py-2">Tạm tính</td>
                                <td class="font-semibold text-right">${formatCurrency(getTotalPrice())}</td>
                            </tr>

                            ${voucherList.map((item) => /* html */`
                                <tr class="border-b">
                                    <td class="font-semibold text-sm py-2">
                                        Voucher
                                        <strong class="ml-1 mr-2">${item.code}</strong>
                                    </td>
                                    <td class="py-2 text-right font-semibold">- ${item.condition ? formatCurrency(item.conditionNumber) : `${item.conditionNumber}%`}</td>
                                </tr>
                            `)}

                            <tr class="border-b">
                                <td class="font-semibold text-sm py-2">Tổng</td>
                                <td class="font-semibold text-right">${formatCurrency(getTotalPrice() - totalPriceVoucher > 0 ? getTotalPrice() - totalPriceVoucher : 0)}</td>
                            </tr>
                        </tfoot>
                    </table>

                    <button class="mt-4 px-3 py-2 bg-orange-400 font-semibold uppercase text-white text-sm transition ease-linear duration-300 hover:shadow-[inset_0_0_100px_rgba(0,0,0,0.2)]">Đặt hàng</button>
                </div>
            </form>
        </main>
        <!-- end content -->

        ${Footer.render()}
        `;
    },
    afterRender() {
        const provinceElement = document.querySelector("#cart__checkout-province");
        const districtElement = document.querySelector("#cart__checkout-district");
        const wardElement = document.querySelector("#cart__checkout-ward");
        const formCheckout = document.querySelector("#cart__checkout-form");
        const fullName = formCheckout.querySelector("#cart__checkout-form-name");
        const phone = formCheckout.querySelector("#cart__checkout-form-phone");
        const email = formCheckout.querySelector("#cart__checkout-form-email");
        const address = formCheckout.querySelector("#cart__checkout-form-add");

        const validate = () => {
            let isValid = true;

            if (!fullName.value) {
                fullName.nextElementSibling.innerText = "Vui lòng nhập tên người nhận";
                isValid = false;
            } else {
                fullName.nextElementSibling.innerText = "";
            }

            const regexPhone = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
            if (!phone.value) {
                phone.nextElementSibling.innerText = "Vui lòng nhập số điện thoại";
                isValid = false;
            } else if (!regexPhone.test(phone.value)) {
                phone.nextElementSibling.innerText = "Số điện thoại không đúng định dạng";
                isValid = false;
            } else {
                phone.nextElementSibling.innerText = "";
            }

            const regexEmail = /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            if (!email.value) {
                email.nextElementSibling.innerText = "Vui lòng nhập email";
                isValid = false;
            } else if (!regexEmail.test(email.value)) {
                email.nextElementSibling.innerText = "Email không đúng định dạng";
                isValid = false;
            } else {
                email.nextElementSibling.innerText = "";
            }

            if (!address.value) {
                address.nextElementSibling.innerText = "Vui lòng nhập địa chỉ";
                isValid = false;
            } else {
                address.nextElementSibling.innerText = "";
            }

            if (!provinceElement.value) {
                provinceElement.nextElementSibling.innerText = "Vui lòng chọn Tỉnh/TP";
                isValid = false;
            } else {
                provinceElement.nextElementSibling.innerText = "";
            }

            if (!districtElement.value) {
                districtElement.nextElementSibling.innerText = "Vui lòng chọn Quận/Huyện";
                isValid = false;
            } else {
                districtElement.nextElementSibling.innerText = "";
            }

            if (!wardElement.value) {
                wardElement.nextElementSibling.innerText = "Vui lòng chọn Xã/Phường";
                isValid = false;
            } else {
                wardElement.nextElementSibling.innerText = "";
            }

            return isValid;
        };

        formCheckout.addEventListener("submit", (e) => {
            e.preventDefault();

            const isValid = validate();

            if (isValid) {
                console.log(123);
            }
        });

        // bắt sự kiện chọn tỉnh/tp
        provinceElement.addEventListener("change", async (e) => {
            const provinceCode = e.target.value;

            if (provinceCode) {
                const districtList = await getDistrict(provinceCode);
                let htmlDistrict = `<option value="">-- Chọn Tỉnh/TP --</option>`;
                districtList.forEach((item) => {
                    htmlDistrict += `<option value="${item.code}">${item.name}</option>`;
                });

                districtElement.innerHTML = htmlDistrict;
            }
        });

        // bắt sự kiện chọn quận/huyện
        districtElement.addEventListener("change", async (e) => {
            const districtCode = e.target.value;

            if (districtCode) {
                const wardList = await getWard(districtCode);
                let htmlWard = `<option value="">-- Chọn Xã/Phường --</option>`;
                wardList.forEach((item) => {
                    htmlWard += `<option value="${item.code}">${item.name}</option>`;
                });

                wardElement.innerHTML = htmlWard;
            }
        });
    },
};

export default CheckoutPage;