import React, { useEffect, useState } from 'react'
import moment from 'moment'
import './PlayVideo.css'
import { API_KEY } from '../../data'
import { value_convertor } from '../../data'
import video1 from '../../assets/video.mp4'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import jack from '../../assets/jack.png'
import user_profile from '../../assets/user_profile.jpg'
import { useParams } from 'react-router-dom'

// function PlayVideo({videoId}) {
const PlayVideo = () => {

    const {videoId} = useParams()

    const [apiData, setApiData] = useState(null)

    const fetchVideoData = async () => {
        const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY} `
        await fetch(videoDetails_url).then(res => res.json()).then(data => setApiData(data.items[0]))
    }

    useEffect(() => {
        fetchVideoData();
    }, [videoId])


    const [channelData, setChannelData] = useState(null)

    const fetchChannelData = async () => {
        const channelDetail_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`

        await fetch(channelDetail_url).then(res => res.json()).then(data => setChannelData(data.items[0]))
    }

    useEffect(() => {
        fetchChannelData();
    }, [apiData])


    const [commentData, setCommentData] = useState([])

    const fetchCommentData = async () => {
        const commentData_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`

        await fetch(commentData_url).then(res => res.json()).then(data => setCommentData(data.items))
    }

    useEffect(() => {
        fetchCommentData()
    }, [apiData])

    return (
        <div className='play-video'>
            {/* <video src={video1} controls autoPlay muted></video> */}
            <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            <h3>{apiData ? apiData.snippet.title : "title here"}</h3>
            <div className='play-video-info'>
                <p>{value_convertor(apiData ? apiData.statistics.viewCount : 100)} Views &bull; {apiData ? moment(apiData.snippet.publishedAt).fromNow() : "2"} </p>
                <div>
                    <span><img src={like} alt="" />{value_convertor(apiData ? apiData.statistics.likeCount : 100)}</span>
                    <span><img src={dislike} alt="" /></span>
                    <span><img src={share} alt="" />Share</span>
                    <span><img src={save} alt="" />Save</span>
                </div>
            </div>
            <hr />
            <div className="publisher">
                <img src={channelData ? channelData.snippet.thumbnails.default.url : ""} alt="" />
                <div>
                    <p>{apiData ? apiData.snippet.channelTitle : "channelTitle here"}</p>
                    <span>{channelData ? value_convertor(channelData.statistics.subscriberCount) : "100"} Subscribers</span>
                </div>
                <button>Subscribe</button>
            </div>
            <div className="vid-description">
                <p>{channelData ? channelData.snippet.description.slice(0, 250) : "description here"}</p>
                <hr />
                <h4>{apiData ? value_convertor(apiData.statistics.commentCount) : "100s"} Comments</h4>


                {commentData.map((item, index) => {
                    return (
                        <div key={index} className='comment'>
                            <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
                            <div>
                                <h3>{item.snippet.topLevelComment.snippet.authorDisplayName} <span>{moment(item.snippet.topLevelComment.publishedAt).fromNow()} ago</span></h3>
                                <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                                <div className="comment-action">
                                    <img src={like} alt="" />
                                    <span>{value_convertor(item.snippet.topLevelComment.snippet.likeCount)}</span>
                                    <img src={dislike} alt="" />
                                </div>
                            </div>
                        </div>
                    )
                })}


            </div>
        </div>
    )
}

export default PlayVideo
