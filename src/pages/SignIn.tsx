import React from "react";
import { Form, Input, Button, Select, Space } from "antd";
import { Typography } from "antd";

const { Title, Link } = Typography;

const rootStyles = {
  maxWidth: "350px",
  margin: "auto",
  marginTop: "30px",
  padding: "20px",
};

const SignIn = () => {
  const [form] = Form.useForm();

  const onFinish = () => console.log("of finish");

  console.log(process.env.REACT_APP_API_GATEWAY);

  return (
    <div style={rootStyles}>
      <Title level={3}>Авторизация</Title>

      <Form form={form} name="control-hooks" onFinish={onFinish}>
        <Form.Item name="email" rules={[{ required: true }]}>
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true }]}>
          <Input placeholder="Пароль" />
        </Form.Item>
        <Form.Item>
          <Space size="large" direction="horizontal">
            <Button type="primary" htmlType="submit">
              Войти
            </Button>
            <Link href="/sign-up">Регистрация</Link>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignIn;
