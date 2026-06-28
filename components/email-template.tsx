import * as React from 'react';
import { Html, Body, Head, Heading, Text, Container, Section, Row, Column, Img, Hr } from '@react-email/components';

interface EmailTemplateProps {
  name: string; email: string; phone: string; district: string; address: string; note: string;
  items: any[]; subtotal: number; shippingFee: number; total: number;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name, email, phone, district, address, note, items, subtotal, shippingFee, total
}) => (
  <Html>
    <Head />
    <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#ffffff', padding: '20px' }}>
      <Container style={{ maxWidth: '600px', border: '1px solid #ddd', borderRadius: '15px', padding: '30px', backgroundColor: '#fffdf5' }}>
        <Heading style={{ color: '#1e3a8a', textAlign: 'center' }}>🌮 Đơn hàng mới: {name}</Heading>
        
        <Section style={{ marginBottom: '20px' }}>
          <Text><strong>Khách hàng:</strong> {name} - {phone}</Text>
          <Text><strong>Email:</strong> {email}</Text>
          <Text><strong>Địa chỉ:</strong> {address}, {district}</Text>
          {note && <Text style={{ color: '#ff6347' }}><strong>Ghi chú bếp:</strong> {note}</Text>}
        </Section>
        
        <Hr />
        
        <Heading as="h3">Danh sách món:</Heading>
        {items.map((item: any, index: number) => (
          <Section key={index} style={{ marginBottom: '10px' }}>
            <Text style={{ margin: 0, fontWeight: 'bold' }}>{item.name} x {item.quantity}</Text>
            {/* Hiển thị các ingredient đã chọn */}
            {(item.selectedIngredients || []).map((ing: any) => (
              <Text key={ing.id} style={{ margin: 0, fontSize: '12px', color: '#666' }}>+ {ing.name}</Text>
            ))}
          </Section>
        ))}
        
        <Hr />
        
        <Text>Tạm tính: {subtotal.toLocaleString()}đ</Text>
        <Text>Phí ship: {shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString()}đ`}</Text>
        <Heading as="h2" style={{ color: '#1e3a8a' }}>Tổng thanh toán: {total.toLocaleString()}đ</Heading>
      </Container>
    </Body>
  </Html>
);