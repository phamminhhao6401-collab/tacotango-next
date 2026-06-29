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

  // Các field mới, để tương thích với logic checkout/route mới
  isUEHFreeShippingSlot?: string;
  isThuDucRequiredSlot?: string;
  shippingDiscountReason?: string;
  deliveryRestrictionNote?: string;
}

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
}) => {
  const paymentMethodLabel =
    paymentMethod === "Bank" ? "Chuyển khoản ngân hàng" : "COD";

  const isUEHSlot =
    isUEHFreeShippingSlot === "Có" ||
    deliverySlot.includes("3:00 pm - 3:30 pm") ||
    note?.includes("Ưu đãi ship");

  const isThuDucSlot =
    isThuDucRequiredSlot === "Có" ||
    (district === "Thủ Đức" && deliverySlot.includes("6:00 pm - 7:00 pm"));

  const noteLines =
    note && note !== "Không có ghi chú"
      ? note.split("\n").filter((line) => line.trim() !== "")
      : [];

  const shippingFeeText =
    shippingFee === 0
      ? isUEHSlot
        ? "Miễn phí - UEH cơ sở B"
        : "Miễn phí"
      : `${shippingFee.toLocaleString("vi-VN")}đ`;

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

            <Text style={{ margin: "5px 0" }}>
              <strong>Phương thức thanh toán:</strong> {paymentMethodLabel}
            </Text>

            {noteLines.length > 0 && (
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
                  Ghi chú đơn hàng:
                </Text>

                {noteLines.map((line, index) => (
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
                    ? ` (${ing.price.toLocaleString("vi-VN")}đ)`
                    : ""}
                </Text>
              ))}
            </Section>
          ))}

          <Hr />

          <Section>
            <Text style={{ margin: "5px 0" }}>
              <strong>Tạm tính:</strong> {subtotal.toLocaleString("vi-VN")}đ
            </Text>

            <Text style={{ margin: "5px 0" }}>
              <strong>Phí ship:</strong> {shippingFeeText}
            </Text>

            {shippingFee === 0 && isUEHSlot && (
              <Text style={{ margin: "5px 0", color: "#15803d" }}>
                Phí ship đã được tự động miễn do khách chọn khung UEH cơ sở B.
              </Text>
            )}

            {shippingDiscountReason && (
              <Text style={{ margin: "5px 0", color: "#15803d" }}>
                {shippingDiscountReason}
              </Text>
            )}

            {deliveryRestrictionNote && (
              <Text style={{ margin: "5px 0", color: "#ff6347" }}>
                {deliveryRestrictionNote}
              </Text>
            )}

            <Heading as="h2" style={{ color: "#4a2c2a" }}>
              Tổng thanh toán: {total.toLocaleString("vi-VN")}đ
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