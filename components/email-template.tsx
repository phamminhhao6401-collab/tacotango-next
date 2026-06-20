import * as React from 'react';
import { Html, Body, Head, Heading, Text, Container, Section, Row, Column, Img, Hr } from '@react-email/components';

interface EmailTemplateProps {
  name: string;
  items: any[];
  subtotal: number;
  phone: string;
  address: string;
  note: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  items,
  subtotal,
  phone,
  address,
  note,
}) => (
  <Html>
    <Head />
    <Body style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif', backgroundColor: '#ffffff', padding: '20px' }}>
      <Container style={{ maxWidth: '600px', border: '1px solid #ddd', borderRadius: '15px', padding: '30px', backgroundColor: '#fffdf5' }}>
        <Heading style={{ color: '#1e3a8a', textAlign: 'center' }}>🌮 Đơn hàng mới từ: {name}</Heading>
        
        <Section style={{ marginBottom: '20px' }}>
          <Text style={{ margin: '5px 0' }}><strong>SĐT:</strong> {phone}</Text>
          <Text style={{ margin: '5px 0' }}><strong>Địa chỉ:</strong> {address}</Text>
          {note && (
            <Text style={{ margin: '10px 0', padding: '10px', backgroundColor: '#ffe5e5', borderRadius: '8px', border: '1px solid #ffccc7' }}>
              <strong>Ghi chú:</strong> {note}
            </Text>
          )}
        </Section>
        
        <Hr style={{ borderColor: '#ddd' }} />
        
        <Heading as="h3" style={{ color: '#ff6347' }}>Danh sách món:</Heading>
        <Section>
          {items.map((item: any, index: number) => (
            <Row key={index} style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
              <Column style={{ width: '60px' }}>
                {item.image && (
                  <Img src={item.image} alt={item.name} width="50" height="50" style={{ borderRadius: '8px' }} />
                )}
              </Column>
              <Column>
                <Text style={{ margin: 0, fontWeight: 'bold' }}>{item.name}</Text>
                <Text style={{ margin: 0, color: '#666', fontSize: '14px' }}>Số lượng: {item.quantity}</Text>
              </Column>
              <Column style={{ textAlign: 'right', fontWeight: 'bold' }}>
                {(item.price * item.quantity).toLocaleString()}đ
              </Column>
            </Row>
          ))}
        </Section>
        
        <Hr style={{ borderColor: '#ddd' }} />
        
        <Text style={{ fontSize: '20px', textAlign: 'right', color: '#1e3a8a', fontWeight: 'bold' }}>
          Tổng cộng: {subtotal.toLocaleString()}đ
        </Text>
      </Container>
    </Body>
  </Html>
);