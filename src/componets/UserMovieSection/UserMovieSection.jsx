import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import MoviePopUp from "../PopUp/MoviePopUp";
import { imageUrl2 } from "../../Constants/Constance";
import useUpdateMylist from "../../CustomHooks/useUpdateMylist";
import usePlayMovie from "../../CustomHooks/usePlayMovie";
import useUpdateWatchedMovies from "../../CustomHooks/useUpdateWatchedMovies";
import useUpdateLikedMovies from "../../CustomHooks/useUpdateLikedMovies";
import useGenreConverter from "../../CustomHooks/useGenereConverter";
import { db } from "../../Firebase/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { AuthContext } from "../../Context/UserContext";
import { PopUpContext } from "../../Context/moviePopUpContext";
import StarRatings from "react-star-ratings";
import { ClipLoader } from "react-spinners";

function UserMovieSection({ from }) {
  const { User } = useContext(AuthContext);
  const { showModal, setShowModal } = useContext(PopUpContext);

  const { addToMyList, removeFromMyList, PopupMessage } = useUpdateMylist();
  const { removeFromWatchedMovies } = useUpdateWatchedMovies();
  const { addToLikedMovies, removeFromLikedMovies } = useUpdateLikedMovies();
  const { playMovie } = usePlayMovie();
  const { convertGenre } = useGenreConverter();

  const [myMovies, setMyMovies] = useState([]);
  const [moviePopupInfo, setMoviePopupInfo] = useState(null);
  const [title, setTitle] = useState("");
  const [isResultEmpty, setIsResultEmpty] = useState(false);

  const navigate = useNavigate();

  const getMovies = async () => {
    if (!User) return;

    const snap = await getDoc(doc(db, from, User.uid));
    if (!snap.exists()) {
      setMyMovies([]);
      setIsResultEmpty(true);
      return;
    }

    const data = snap.data();
    setMyMovies(data.movies || []);
    setIsResultEmpty((data.movies || []).length === 0);
  };

  useEffect(() => {
    getMovies();

    if (from === "MyList") setTitle("Movies in My List");
    if (from === "WatchedMovies") setTitle("Watched Movies");
    if (from === "LikedMovies") setTitle("Movies You Liked");
  }, [User, from]);

  const removeMovie = (movie) => {
    if (from === "MyList") removeFromMyList(movie);
    if (from === "WatchedMovies") removeFromWatchedMovies(movie);
    if (from === "LikedMovies") removeFromLikedMovies(movie);
    getMovies();
  };

  const handleMoviePopup = (movie) => {
    setMoviePopupInfo(movie);
    setShowModal(true);
  };

  return (
    <div>
      {PopupMessage}

      <h1 className="text-white pt-20 pb-6 text-4xl text-center">
        {!isResultEmpty && title}
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 p-4">
        {myMovies.length > 0 ? (
          myMovies
            .slice()
            .reverse()
            .map((movie) => (
              <div
                key={movie.id}
                className="group relative cursor-pointer"
                onClick={() => handleMoviePopup(movie)}
              >
                <img
                  src={imageUrl2 + movie.backdrop_path}
                  alt={movie.title || movie.name}
                  className="rounded-md"
                />

                <div className="absolute bottom-0 w-full p-3 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition">
                  <h3 className="text-white font-semibold">
                    {movie.title || movie.name}
                  </h3>

                  <StarRatings
                    rating={movie.vote_average / 2}
                    starRatedColor="#facc15"
                    numberOfStars={5}
                    starDimension="1rem"
                  />

                  <div className="text-xs text-gray-300 mt-1">
                    {movie.genre_ids &&
                      convertGenre(movie.genre_ids).map((g, i) => (
                        <span key={i} className="mr-2">
                          {g}
                        </span>
                      ))}
                  </div>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playMovie(movie, from);
                      }}
                      className="px-3 py-1 bg-accent text-white rounded"
                    >
                      ▶ Play
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToLikedMovies(movie);
                      }}
                      className="px-3 py-1 border text-white rounded"
                    >
                      ❤
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToMyList(movie);
                      }}
                      className="px-3 py-1 border text-white rounded"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className="col-span-full flex justify-center items-center h-[60vh]">
            {!isResultEmpty ? (
              <ClipLoader color="#ffffff" size={120} />
            ) : (
              <div className="text-center">
                <h2 className="text-white text-4xl mb-4">
                  No Movies Present
                </h2>
                <button
                  onClick={() => navigate("/")}
                  className="bg-accent px-8 py-3 text-white rounded"
                >
                  Back to Home
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <MoviePopUp data1={moviePopupInfo} from={from} />
      )}
    </div>
  );
}

export default UserMovieSection;
