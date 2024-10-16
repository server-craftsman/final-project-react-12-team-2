import { useParams } from "react-router-dom";
import cartData from "../../../data/carts.json";
import { Card, Row, Col, Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";

const ViewPurchaseDetails = () => {
  const { id } = useParams<{ id: string }>(); // Get ID from URL

  const purchaseDetails = cartData.carts.find((purchase) => purchase.id === id); // Find cart details by ID

  if (purchaseDetails) {
    return (
      <div className="mx-auto max-w-2xl p-5">
        <Card
          title={`Purchase No: ${purchaseDetails.cart_no}`}
          className="shadow-lg"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Row>
                <Col span={12}>
                  <strong>Purchase ID:</strong>
                </Col>
                <Col span={12}>{purchaseDetails.id}</Col>
              </Row>
              <Row>
                <Col span={12}>
                  <strong>Cart No:</strong>
                </Col>
                <Col span={12}>{purchaseDetails.cart_no}</Col>
              </Row>
              <Row>
                <Col span={12}>
                  <strong>Status:</strong>
                </Col>
                <Col span={12}>{purchaseDetails.status}</Col>
              </Row>
              <Row>
                <Col span={12}>
                  <strong>Price Paid:</strong>
                </Col>
                <Col
                  span={12}
                >{`$${purchaseDetails.price_paid.toFixed(2)}`}</Col>
              </Row>
              <Row>
                <Col span={12}>
                  <strong>Price:</strong>
                </Col>
                <Col span={12}>{`$${purchaseDetails.price.toFixed(2)}`}</Col>
              </Row>
              <Row>
                <Col span={12}>
                  <strong>Discount:</strong>
                </Col>
                <Col span={12}>{`${purchaseDetails.discount.toFixed(2)}%`}</Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row>
                <Col span={12}>
                  <strong>Created At:</strong>
                </Col>
                <Col span={12}>
                  {new Date(purchaseDetails.created_at).toLocaleDateString()}
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <strong>Updated At:</strong>
                </Col>
                <Col span={12}>
                  {new Date(purchaseDetails.updated_at).toLocaleDateString()}
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <strong>Deleted:</strong>
                </Col>
                <Col span={12}>{purchaseDetails.is_deleted ? "Yes" : "No"}</Col>
              </Row>
            </Col>
          </Row>
        </Card>
        <Button
          type="primary"
          icon={<HomeOutlined />}
          className="mt-4"
          onClick={() => window.history.back()}
        >
          Back to Purchases
        </Button>
      </div>
    );
  } else {
    return <div>Purchase not found</div>;
  }
};

export default ViewPurchaseDetails;
