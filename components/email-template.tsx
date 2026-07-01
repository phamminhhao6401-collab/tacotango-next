import * as React from "react";
import {
  Html,
  Body,
  Head,
  Heading,
  Text,
  Container,
  Section,
  Hr,
} from "@react-email/components";

interface EmailTemplateProps {
  name: string;
  email: string;
  phone: string;
  district: string;
  address: string;
  note: string;
  items: any[];
  subtotal: number;
  shippingFee: number;
  total: number;
  deliverySlot: string;
  paymentMethod: string;

  // Field cũ cho logic UEH / Thủ Đức
  isUEHFreeShippingSlot?: string;
  isThuDucRequiredSlot?: string;
  shippingDiscountReason?: string;
  deliveryRestrictionNote?: string;

  // Field mới cho mã freeship
  promoCode?: string;
  isPromoApplied?: string;
  promoDiscountReason?: string;
}

const FREE_SHIPPING_THRESHOLD = 150000;

const formatVND = (value: number) => {
  return `${Number(value || 0).toLocaleString("vi-VN")}đ`;
};

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  email,
  phone,
  district,
  address,
  note,
  items,
  subtotal,
  shippingFee,
  total,
  deliverySlot,
  paymentMethod,

  isUEHFreeShippingSlot = "Không",
  isThuDucRequiredSlot = "Không",
  shippingDiscountReason = "",
  deliveryRestrictionNote = "",

  promoCode = "",
  isPromoApplied = "Không",
  promoDiscountReason = "",
}) => {
  const paymentMethodLabel =
    paymentMethod === "Bank" ? "Chuyển khoản ngân hàng" : "COD";

  const normalizedNote = note || "";
  const normalizedPromoCode = promoCode.trim().toUpperCase();

  const rawNoteLines =
    normalizedNote && normalizedNote !== "Không có ghi chú"
      ? normalizedNote
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
      : [];

  const hasPromoFromNote = rawNoteLines.some(
    (line) =>
      line.includes("Ưu đãi mã freeship") ||
      line.includes("Miễn phí ship bằng mã")
  );

  const hasUEHFromNote = rawNoteLines.some(
    (line) =>
      line.includes("UEH") ||
      line.includes("cơ sở B") ||
      line.includes("Nguyễn Tri Phương")
  );

  const hasThuDucFromNote = rawNoteLines.some(
    (line) =>
      line.includes("Thủ Đức") ||
      line.includes("T6 (03/07), 6:00 pm - 7:00 pm")
  );

  const isUEHSlot =
    isUEHFreeShippingSlot === "Có" ||
    deliverySlot.includes("UEH") ||
    deliverySlot.includes("3:00 pm - 3:30 pm") ||
    hasUEHFromNote;

  const isThuDucSlot =
    isThuDucRequiredSlot === "Có" ||
    (district === "Thủ Đức" && deliverySlot.includes("6:00 pm - 7:00 pm")) ||
    hasThuDucFromNote;

  const isPromoFreeShipping =
    shippingFee === 0 &&
    (isPromoApplied === "Có" || Boolean(normalizedPromoCode) || hasPromoFromNote);

  const isSubtotalFreeShipping =
    shippingFee === 0 && subtotal >= FREE_SHIPPING_THRESHOLD;

  const customerNoteLines = rawNoteLines.filter((line) => {
    const isSystemNote =
      line.startsWith("Ưu đãi ship:") ||
      line.startsWith("Ưu đãi mã freeship:") ||
      line.startsWith("Ghi chú giao hàng:");

    return !isSystemNote;
  });

  const shippingFeeText =
    shippingFee === 0
      ? isUEHSlot
        ? "Miễn phí - UEH cơ sở B"
        : isPromoFreeShipping
          ? normalizedPromoCode
            ? `Miễn phí - mã ${normalizedPromoCode}`
            : "Miễn phí - mã freeship"
          : isSubtotalFreeShipping
            ? "Miễn phí - đơn từ 150.000đ"
            : "Miễn phí"
      : formatVND(shippingFee);

  const promoText =
    promoDiscountReason ||
    (normalizedPromoCode
      ? `Miễn phí ship bằng mã ${normalizedPromoCode}`
      : hasPromoFromNote
        ? "Đơn hàng đã áp dụng mã freeship"
        : "");

  return (
    <Html>
      <Head />

      <Body
        style={{
          fontFamily: "sans-serif",
          backgroundColor: "#ffffff",
          padding: "20px",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            border: "1px solid #ddd",
            borderRadius: "15px",
            padding: "30px",
            backgroundColor: "#fffdf5",
          }}
        >
          <Heading style={{ color: "#4a2c2a", textAlign: "center" }}>
            🌮 Đơn hàng mới: {name}
          </Heading>

          <Section style={{ marginBottom: "20px" }}>
            <Text style={{ margin: "5px 0" }}>
              <strong>Khách hàng:</strong> {name} - {phone}
            </Text>

            <Text style={{ margin: "5px 0" }}>
              <strong>Email:</strong> {email}
            </Text>

            <Text style={{ margin: "5px 0" }}>
              <strong>Địa chỉ:</strong> {address}, {district}
            </Text>

            <Text style={{ margin: "5px 0" }}>
              <strong>Khung giờ giao:</strong> {deliverySlot}
            </Text>

            {isThuDucSlot && (
              <Text style={{ margin: "5px 0", color: "#ff6347" }}>
                <strong>Lưu ý giao hàng:</strong> Khách ở Thủ Đức chỉ nhận hàng
                vào T6 (03/07), 6:00 pm - 7:00 pm.
              </Text>
            )}

            {isUEHSlot && (
              <Text style={{ margin: "5px 0", color: "#15803d" }}>
                <strong>Ưu đãi ship:</strong> Miễn phí ship cho sinh viên UEH
                có mặt tại cơ sở B - Nguyễn Tri Phương vào T5 (02/07), 3:00 pm -
                3:30 pm.
              </Text>
            )}

            {isPromoFreeShipping && promoText && (
              <Text style={{ margin: "5px 0", color: "#15803d" }}>
                <strong>Mã freeship:</strong> {promoText}
              </Text>
            )}

            <Text style={{ margin: "5px 0" }}>
              <strong>Phương thức thanh toán:</strong> {paymentMethodLabel}
            </Text>

            {customerNoteLines.length > 0 && (
              <Section
                style={{
                  marginTop: "10px",
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundColor: "#fff0e8",
                }}
              >
                <Text
                  style={{
                    color: "#ff6347",
                    margin: "0 0 6px 0",
                    fontWeight: "bold",
                  }}
                >
                  Ghi chú của khách:
                </Text>

                {customerNoteLines.map((line, index) => (
                  <Text
                    key={index}
                    style={{
                      color: "#333",
                      margin: "3px 0",
                      fontSize: "14px",
                    }}
                  >
                    {line}
                  </Text>
                ))}
              </Section>
            )}
          </Section>

          <Hr />

          <Heading as="h3" style={{ color: "#4a2c2a" }}>
            Danh sách món:
          </Heading>

          {items.map((item: any, index: number) => (
            <Section key={index} style={{ marginBottom: "10px" }}>
              <Text style={{ margin: 0, fontWeight: "bold" }}>
                {item.name} x {item.quantity}
              </Text>

              {typeof item.price === "number" && (
                <Text
                  style={{
                    margin: "2px 0",
                    fontSize: "13px",
                    color: "#333",
                  }}
                >
                  Giá món: {formatVND(item.price)}
                </Text>
              )}

              {(item.selectedIngredients || []).map((ing: any) => (
                <Text
                  key={ing.id}
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: "#666",
                  }}
                >
                  + {ing.name}
                  {typeof ing.price === "number"
                    ? ` (${formatVND(ing.price)})`
                    : ""}
                </Text>
              ))}
            </Section>
          ))}

          <Hr />

          <Section>
            <Text style={{ margin: "5px 0" }}>
              <strong>Tạm tính:</strong> {formatVND(subtotal)}
            </Text>

            <Text style={{ margin: "5px 0" }}>
              <strong>Phí ship:</strong> {shippingFeeText}
            </Text>

            {shippingFee === 0 && isUEHSlot && (
              <Text style={{ margin: "5px 0", color: "#15803d" }}>
                Phí ship đã được tự động miễn do khách chọn khung UEH cơ sở B.
              </Text>
            )}

            {shippingFee === 0 && isPromoFreeShipping && promoText && (
              <Text style={{ margin: "5px 0", color: "#15803d" }}>
                {promoText}
              </Text>
            )}

            {shippingFee === 0 &&
              isSubtotalFreeShipping &&
              !isUEHSlot &&
              !isPromoFreeShipping && (
                <Text style={{ margin: "5px 0", color: "#15803d" }}>
                  Đơn hàng từ 150.000đ nên được miễn phí ship.
                </Text>
              )}

            {shippingDiscountReason && !isUEHSlot && (
              <Text style={{ margin: "5px 0", color: "#15803d" }}>
                {shippingDiscountReason}
              </Text>
            )}

            {deliveryRestrictionNote && !isThuDucSlot && (
              <Text style={{ margin: "5px 0", color: "#ff6347" }}>
                {deliveryRestrictionNote}
              </Text>
            )}

            <Heading as="h2" style={{ color: "#4a2c2a" }}>
              Tổng thanh toán: {formatVND(total)}
            </Heading>
          </Section>

          <Section
            style={{
              marginTop: "40px",
              paddingTop: "20px",
              borderTop: "2px solid #4a2c2a",
              textAlign: "center",
            }}
          >
            <Text
              style={{
                fontStyle: "italic",
                color: "#4a2c2a",
                margin: "0 0 10px 0",
              }}
            >
              Giòn tan nhịp vangg!
            </Text>

            <Text
              style={{
                fontSize: "14px",
                color: "#333",
                margin: "5px 0",
              }}
            >
              <strong>THÔNG TIN LIÊN LẠC</strong>
            </Text>

            <Text
              style={{
                fontSize: "13px",
                color: "#555",
                margin: "2px 0",
              }}
            >
              Phone: 0971427898 (Phương Nghi), 0983422007 (Nhật Lệ)
            </Text>

            <Text
              style={{
                fontSize: "13px",
                color: "#555",
                margin: "2px 0",
              }}
            >
              Facebook: Taco Tango | Instagram: tacotango_2026
            </Text>

            <Text
              style={{
                fontSize: "13px",
                color: "#555",
                margin: "2px 0",
              }}
            >
              Email: tacotango2026@gmail.com
            </Text>

            <Text
              style={{
                fontSize: "13px",
                color: "#555",
                margin: "2px 0",
              }}
            >
              Địa chỉ: 279 Nguyễn Tri Phương, phường Diên Hồng, TP.HCM
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};