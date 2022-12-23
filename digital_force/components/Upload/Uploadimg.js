import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
  Text,
  HStack,
  Stack,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import styles from "../Upload/upload.module.css";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/dist/client/router";

function Uploadimg() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("userInfo"));
    if (user.userExists && user.userExists.role === "member") {
      console.log(user.userExists);
      getimages();
    } else {
      toast({
        title: "User Is Not Authorized",
        position: "top",
        description: "To See This Page You Have To Signup As Member",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      router.push("/");
    }
  }, []);

  // useEffect(() => {
  //   getimages();
  // }, []);

  const onChange = (e) => {
    setFiles(e.target.files);
  };

  async function getimages() {
    try {
      let id = getCookie("useInfo");
      const res = await axios.get("http://localhost:3000/api/upload/", {
        headers: {
          id: id,
        },
      });
      //console.log(res.data);
      setImages(res.data);
      //console.log(images);
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong",
        position: "top",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.values(files).forEach((ele) =>
      formData.append("imgCollection", ele)
    );
    console.log(formData);
    try {
      let id = getCookie("useInfo");
      const res = await axios.post(
        "http://localhost:3000/api/upload/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            id: id,
          },
        }
      );
      //console.log(res.message);
      console.log(res);
      toast({
        title: "Images Added Successfully",
        position: "top",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      //console.log(err.response.status);
      console.log(err);
      toast({
        title: "Something went wrong",
        position: "top",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    getimages();
  };

  async function deleteimg(img) {
    //console.log(img)
    //console.log(img.target.value);
    try {
      let id = getCookie("useInfo");
      let res = axios.delete(`http://localhost:3000/api/upload/`, {
        headers: {
          img: img,
          id: id,
        },
      });
      console.log(res.data);
      toast({
        title: "Image Deleted Successfully",
        position: "top",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      getimages();
    } catch (error) {
      toast({
        title: "Something went wrong",
        position: "top",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.log(error);
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload new images</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              border={"1px dashed"}
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              {" "}
              <Text mt={1}>Drop Files here</Text>
              <Text>or</Text>
              <div className={styles.uploads}>
                <form onSubmit={onSubmit}>
                  <div>
                    <input
                      type="file"
                      id="file"
                      multiple
                      name="imgCollection"
                      onChange={onChange}
                    />
                  </div>

                  <HStack
                    display={"flex"}
                    flexDirection={"row"}
                    alignItems={"center"}
                    justifyContent={"flex-end"}
                    spacing={4}
                  >
                    <button
                      type="submit"
                      value="Upload"
                      onClick={() => onClose()}
                    >
                      Upload
                    </button>
                    <button onClick={() => onClose()}>Close</button>
                  </HStack>
                </form>
              </div>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
      <div className={styles.hero}>
        <Box
          display={"flex"}
          flexWrap={"wrap"}
          justifyContent={"space-between"}
          alignItems={"center"}
          gap={"12px"}
          padding={"16px 64px"}
        >
          <Stack gridAutoFlow={"column"}>
            <h2>Media Library</h2>
            <h4>{images.length} images</h4>
          </Stack>
          <Box
            display={"flex"}
            flexDirection={["column-reverse", "column-reverse", "row", "row"]}
            gap={"20px"}
          >
            <button onClick={() => onOpen()}>
              <h6>Upload New Image</h6>
            </button>
          </Box>
        </Box>
        {images.length === 0 ? (
          <div className={styles.image}>
            <img src={`/upalod.png`} alt="" />
            <p>Click on Upload new image to start adding images</p>
          </div>
        ) : (
          <div className={styles.allimg}>
            {images?.map((ele) => (
              <div key={ele}>
                <img src={ele} alt="" />
                <Button onClick={() => deleteimg(ele)}>Delete</Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
export default Uploadimg;
