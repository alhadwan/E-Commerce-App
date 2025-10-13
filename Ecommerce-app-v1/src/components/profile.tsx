import { useAuth } from "../hooks/useAuth";
import { Card, ListGroup, Button, Form } from "react-bootstrap";
import { useState } from "react";

const Profile = () => {
  const { userProfile, loading, updateUser } = useAuth();
  const [newEmail, setNewEmail] = useState<string>("");
  const [newName, setNewName] = useState<string>("");

  if (loading) {
    return <div className="d-flex justify-content-center mt-5">Loading...</div>;
  }

  const handleUpdateName = async () => {
    if (!userProfile || !newName.trim()) return;

    try {
      await updateUser(userProfile.uid, { name: newName });
      setNewName(""); // Clear input after successful update
      alert("Name updated successfully!");
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  const handleUpdateEmail = async () => {
    if (!userProfile || !newEmail.trim()) return;

    try {
      await updateUser(userProfile.uid, { email: newEmail });
      setNewEmail(""); // Clear input after successful update
      alert("Email updated successfully!");
    } catch (error) {
      console.error("Error updating email:", error);
    }
  };

  return (
    <>
      <div className="container mt-4">
        <h2>User Profile</h2>
        {userProfile ? (
          <Card>
            <Card.Header className="text-center">
              Welcome {userProfile.name}
            </Card.Header>
            <ListGroup>
              <ListGroup.Item className="text-center">
                Email: {userProfile.email}
              </ListGroup.Item>
              <ListGroup.Item className="text-center">
                Created At:{" "}
                {userProfile.createdAt instanceof Date
                  ? userProfile.createdAt.toLocaleDateString()
                  : userProfile.createdAt &&
                      typeof userProfile.createdAt === "object" &&
                      "toDate" in userProfile.createdAt
                    ? (userProfile.createdAt as { toDate: () => Date })
                        .toDate()
                        .toLocaleDateString()
                    : "Invalid date"}
              </ListGroup.Item>
              <ListGroup.Item className="text-center">
                UserID: {userProfile.uid}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        ) : (
          <div className="alert alert-info">Loading profile information...</div>
        )}
      </div>
      <div className="container mt-4">
        <h3>Update Profile</h3>
        <div className="mb-3">
          <Form.Group>
            <Form.Label>Update Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter new name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </Form.Group>
          <Button
            variant="primary"
            onClick={handleUpdateName}
            disabled={!newName.trim()}
            className="mt-2"
          >
            Update Name
          </Button>
        </div>

        <div className="mb-3">
          <Form.Group>
            <Form.Label>Update Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter new email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </Form.Group>
          <Button
            variant="primary"
            onClick={handleUpdateEmail}
            disabled={!newEmail.trim()}
            className="mt-2"
          >
            Update Email
          </Button>
        </div>
      </div>
    </>
  );
};

export default Profile;
