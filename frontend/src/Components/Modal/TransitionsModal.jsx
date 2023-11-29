import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import { useState } from "react";
import { BarcodeScanner } from "../BarcodeScanner";
import { ManualCreateComponent } from "../ManualCreateComponent/ManualCreateComponent";
import "./Modal.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxHeight: "70%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflow: "scroll",
};
export const TransitionsModal = ({ open, setOpen }) => {
  const handleClose = () => setOpen(false);

  // 0 = manual, 1 = barcode
  const [createType, setCreateType] = useState(null);
  // camera state
  const [cameraOn, setCameraOn] = useState(false);

  const onBackClick = () => {
    if (createType === 1) {
      toggleCamera();
    }
    setCreateType(null);
  };

  const toggleCamera = () => {
    setCameraOn((prevCameraOn) => !prevCameraOn);
  };

  return (
    <div style={{ margin: "10px" }}>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Button
              className="closeButton"
              onClick={() => {
                setOpen(false);
                setCreateType(null);
                if (createType === 1) {
                  toggleCamera();
                }
              }}
            >
              X
            </Button>
            <div className="modal-header" hidden={createType !== null}>
              <div style={{ textAlign: "center" }}>
                <h2 id="transition-modal-title">Create Food Item</h2>
                <p id="transition-modal-description">
                  Please select a method to create a food item.
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Button
                  onClick={() => {
                    setCreateType(0);
                  }}
                >
                  Create Manually
                </Button>
                <Button
                  style={{ margin: "10px" }}
                  key="Scan Barcode"
                  onClick={() => {
                    toggleCamera();
                    setCreateType(1);
                  }}
                >
                  Scan Barcode
                </Button>
              </div>
            </div>
            {/* Create manually component */}
            {createType === 0 && (
              <ManualCreateComponent
                setCreateType={setCreateType}
                setOpen={setOpen}
              />
            )}
            {/* Barcode scanner component */}
            {cameraOn && createType === 1 && (
              <BarcodeScanner setCreateType={setCreateType} setOpen={setOpen} />
            )}

            {createType !== null && (
              <Button
                onClick={() => {
                  onBackClick();
                }}
              >
                Back
              </Button>
            )}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
export default TransitionsModal;
