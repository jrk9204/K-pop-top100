import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import TableHeader from "../components/tableHeader";
import getMelonData from "../crwaling/getMelonData";
import { MelonDataType } from "../types/dataTypes";
import Image from "next/image";
import youtubeImage from "../../public/images/youtube.png";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ServiceAPI from "../pages/services/search.service";
import useStore from "../store";
import { useQuery } from "@tanstack/react-query";

const HeaderData = [
    { width: "5%", name: "Ranking" },
    { width: "15%", name: "Album Image" },
    { width: "15%", name: "Title" },
    { width: "20%", name: "Singer" },
    { width: "20%", name: "Album" },
    { width: "25%", name: "Youtube" },
];

export default function MusicChart() {
    const melonData = useQuery(["melonData"], () => getMelonData());

    const [requestYouTube, setRequestYouTube] = useState({ title: "", singer: "" });

    const [isClicked, setIsClicked] = useState(false);

    const youtubeData = useQuery(
        ["youtubeData", requestYouTube],
        () => ServiceAPI.getYoutubeLink(requestYouTube.title + " " + requestYouTube.singer),
        { enabled: isClicked, staleTime: 1000 * 20 }
    );

    const [currMusic, setCurrMusic] = useState<number>(-1);

    const handleModal = () => {
        setIsClicked((pre) => !pre);
    };

    useEffect(() => {
        let timer: any;
        if (!isClicked) {
            timer = setTimeout(() => setIsClicked(false), 500);
        }

        return () => {
            clearTimeout(timer);
        };
    }, [isClicked]);

    const handleMusicYoutube = (dataId: number, title: string, singer: string) => {
        setRequestYouTube((pre) => ({ ...pre, title: title, singer: singer }));
        handleModal();
        setCurrMusic(dataId);
    };

    return (
        <CharContainer>
            <SubHeader>Korean popular music Top 50</SubHeader>

            <TableContainer>
                <TableRow>
                    <HeadTableRow>
                        {HeaderData.map((el, idx) => {
                            return (
                                <TableHeader key={idx} width={el.width}>
                                    {el.name}
                                </TableHeader>
                            );
                        })}
                    </HeadTableRow>
                </TableRow>

                <TableBody>
                    {melonData.data &&
                        melonData.data.map((el, idx) => {
                            return (
                                <BodyTableRow key={idx}>
                                    <TableRankingData>{el.ranking}</TableRankingData>
                                    <TableData>
                                        {el.albumImg && (
                                            <Image
                                                src={el.albumImg}
                                                alt="album Img"
                                                width="58"
                                                height="58"
                                            />
                                        )}
                                    </TableData>
                                    <TableData>{el.title}</TableData>
                                    <TableData>{el.musician}</TableData>
                                    <TableData>{el.albumName}</TableData>
                                    <YoutubeIcon
                                        onClick={() =>
                                            handleMusicYoutube(idx, el.title, el.musician)
                                        }
                                    >
                                        <Image
                                            src={youtubeImage}
                                            alt="youtube Img"
                                            width="40"
                                            height="40"
                                        />
                                    </YoutubeIcon>
                                </BodyTableRow>
                            );
                        })}
                </TableBody>
            </TableContainer>

            <ModalContainer
                open={isClicked}
                onClose={handleModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <ModalBox isClicked={isClicked}>
                    <div>
                        {melonData.data && currMusic !== -1 && (
                            <MusicInfo>
                                <MusicTitle>{melonData.data[currMusic].title} - </MusicTitle>
                                <MusicSinger>
                                    &nbsp; {melonData.data[currMusic].musician}
                                </MusicSinger>
                                <CloseMusicInfo onClick={handleModal}>x</CloseMusicInfo>
                            </MusicInfo>
                        )}
                        <div>dd</div>
                        {/* <YoutubePlayer
                            id="player"
                            src={`http://www.youtube.com/embed/${youtubeData?.data?.items[0]?.id?.videoId}?rel=0&autoplay=1&amp;controls=1&amp;showinfo=0&amp;enablejsapi=1&amp;version=3&allowfullscreen`}
                        ></YoutubePlayer> */}
                    </div>
                </ModalBox>
            </ModalContainer>
        </CharContainer>
    );
}

const CharContainer = styled.div``;

const TableContainer = styled.table`
    overflow: hidden;
    background-color: #edebeb;
    color: #606060;
    border-collapse: collapse;
    overflow-y: auto;
    border-radius: 5px;
`;
const TableBody = styled.tbody`
    text-align: center;
`;

const SubHeader = styled.header`
    margin-bottom: 3rem;
    font-weight: bold;
    font-size: 3rem;
    color: white;

    @media (max-width: 768px) {
        font-size: 2rem;
    }
    /* text-align: center; */
`;

const TableRow = styled.thead`
    position: sticky;
    top: 15px;
    z-index: 1;
`;

const HeadTableRow = styled.tr``;

const YoutubeTr = styled.tr``;

const BodyTableRow = styled.tr`
    border-bottom: 1px solid #d4d4d4;
    padding: 0 30px;
`;

const YoutubeIcon = styled.td`
    cursor: pointer;
`;

const TableData = styled.td`
    padding: 10px;
`;

const TableRankingData = styled(TableData)`
    font-weight: 900;
`;

const YoutubePlayer = styled.iframe`
    width: 100%;
    height: 500px;
    outline: none;
    border: 5px solid white;
    border-radius: 4px;
    border-top-left-radius: 0px;

    @media (max-width: 768px) {
        width: 100%;
        height: 360px;
    }
`;

const ModalContainer = styled(Modal)``;

// const modalSettings = (visible: boolean) => css`
//   visibility: ${visible ? 'visible' : 'hidden'};
//   z-index: 15;
//   animation: ${visible ? fadeIn : fadeOut} 0.15s ease-out;
//   transition: visibility 0.15s ease-out;
// `;

const blowUpModalTwo = keyframes`
    0% {
        transform: scale(0);
        opacity: 0;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
`;

const blowDownModalTwo = keyframes`
    0% {
        transform: scale(1);
        opacity: 1;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
`;

const ModalBox = styled(Box)<{ isClicked: boolean }>`
    position: absolute;
    top: 10%;
    left: 15%;
    width: 70%;
    /* transform: translate(-50%, -50%); */
    // border: "4px solid #000",
    outline: none;
    box-shadow: 24;
    border-radius: 3px;
    padding: 2rem;
    background: "#edebeb";
    color: "#606060";

    animation: ${(props) => (props.isClicked ? blowUpModalTwo : blowDownModalTwo)} 1s
        cubic-bezier(0.165, 0.84, 0.44, 1) forwards;

    @media (max-width: 768px) {
        top: 20%;
        left: 10%;
        width: 600px;
    }
`;

const MusicTitle = styled.span`
    display: inline-block;
    font-weight: bold;
`;

const MusicSinger = styled.span`
    display: inline-block;
    font-weight: bold;
`;

const MusicInfo = styled.span`
    display: inline-block;
    width: auto;
    text-align: center;
    padding: 10px;
    background: white;
    color: black;
    font-size: 1.5rem;
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;

    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;

const CloseMusicInfo = styled.span`
    position: absolute;
    color: white;
    right: 30px;
    cursor: pointer;
`;
