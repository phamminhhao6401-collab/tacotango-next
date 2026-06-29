import * as React from 'react';
import { Html, Body, Head, Heading, Text, Container, Section, Hr } from '@react-email/components';

interface EmailTemplateProps {
  name: string; email: string; phone: string; district: string; address: string; 
  note: string; items: any[]; subtotal: number; shippingFee: number; total: number;
  deliverySlot: string; paymentMethod: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name, email, phone, district, address, note, items, subtotal, shippingFee, total, deliverySlot, paymentMethod
}) => (
  <Html>
    <Head />
    <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#ffffff', padding: '20px' }}>
      <Container style={{ maxWidth: '600px', border: '1px solid #ddd', borderRadius: '15px', padding: '30px', backgroundColor: '#fffdf5' }}>
        <Heading style={{ color: '#4a2c2a', textAlign: 'center' }}>🌮 Đơn hàng mới: {name}</Heading>
        
        <Section style={{ marginBottom: '20px' }}>
          <Text style={{ margin: '5px 0' }}><strong>Khách hàng:</strong> {name} - {phone}</Text>
          <Text style={{ margin: '5px 0' }}><strong>Email:</strong> {email}</Text>
          <Text style={{ margin: '5px 0' }}><strong>Địa chỉ:</strong> {address}, {district}</Text>
          <Text style={{ margin: '5px 0' }}><strong>Khung giờ giao:</strong> {deliverySlot}</Text>
          <Text style={{ margin: '5px 0' }}><strong>Phương thức thanh toán:</strong> {paymentMethod === 'Bank' ? 'Chuyển khoản ngân hàng' : 'COD'}</Text>
          {note && <Text style={{ color: '#ff6347', margin: '5px 0' }}><strong>Ghi chú bếp:</strong> {note}</Text>}
        </Section>
        
        <Hr />
        
        <Heading as="h3" style={{ color: '#4a2c2a' }}>Danh sách món:</Heading>
        {items.map((item: any, index: number) => (
          <Section key={index} style={{ marginBottom: '10px' }}>
            <Text style={{ margin: 0, fontWeight: 'bold' }}>{item.name} x {item.quantity}</Text>
            {(item.selectedIngredients || []).map((ing: any) => (
              <Text key={ing.id} style={{ margin: 0, fontSize: '12px', color: '#666' }}>+ {ing.name}</Text>
            ))}
          </Section>
        ))}
        
        <Hr />
        
        <Text>Tạm tính: {subtotal.toLocaleString()}đ</Text>
        <Text>Phí ship: {shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString()}đ`}</Text>
        <Heading as="h2" style={{ color: '#4a2c2a' }}>Tổng thanh toán: {total.toLocaleString()}đ</Heading>

        {/* PHẦN CHÂN TRANG CHUYÊN NGHIỆP */}
        <Section style={{ marginTop: '40px', paddingTop: '20px', borderTop: '2px solid #4a2c2a', textAlign: 'center' }}>
          <Text style={{ fontStyle: 'italic', color: '#4a2c2a', margin: '0 0 10px 0' }}>Giòn tan nhịp vangg!</Text>
          <Text style={{ fontSize: '14px', color: '#333', margin: '5px 0' }}><strong>THÔNG TIN LIÊN LẠC</strong></Text>
          <Text style={{ fontSize: '13px', color: '#555', margin: '2px 0' }}>Phone: 0971427898 (Phương Nghi), 0983422007 (Nhật Lệ)</Text>
          <Text style={{ fontSize: '13px', color: '#555', margin: '2px 0' }}>Facebook: Taco Tango | Instagram: tacotango_2026</Text>
          <Text style={{ fontSize: '13px', color: '#555', margin: '2px 0' }}>Email: tacotango2026@gmail.com</Text>
          <Text style={{ fontSize: '13px', color: '#555', margin: '2px 0' }}>Địa chỉ: 279 Nguyễn Tri Phương, phường Diên Hồng, TP.HCM</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);