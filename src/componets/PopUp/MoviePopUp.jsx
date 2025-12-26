import React, { useState, useEffect, useContext } from "react";
import { Fade } from "react-reveal";
import StarRatings from "react-star-ratings";
import { imageUrl } from "../../Constants/Constance";
import { PopUpContext } from "../../Context/moviePopUpContext";
import useUpdateMylist from "../../CustomHooks/useUpdateMylist";
import usePlayMovie from "../../CustomHooks/usePlayMovie";
import useGenereConverter from "../../CustomHooks/useGenereConverter";
import useUpdateLikedMovies from "../../CustomHooks/useUpdateLikedMovies";
import useUpdateWatchedMovies from "../../CustomHooks/useUpdateWatchedMovies";

function MoviePopUp({ data1, from }) {
  const { showModal, setShowModal } = useContext(PopUpContext);

  const { addToMyList, removeFromMyList, PopupMessage } = useUpdateMylist();
  const { addToLikedMovies, removeFromLikedMovies } = useUpdateLikedMovies();
  const { removeFromWatchedMovies } = useUpdateWatchedMovies();
  const { playMovie } = usePlayMovie();
  const { convertGenere } = useGenereConverter();

  const [popupInfo, setPopupInfo] = useState(null);

  useEffect(() => {
    setPopupInfo(data1);
  }, [data1]);

  if (!popupInfo) return null;

  return (
    <>
      {PopupMessage}

      {showModal && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
            <Fade bottom duration={500}>
              <div className="relative w-full max-w-3xl mx-4 bg-neutral-800 rounded-lg shadow-lg">
                {/* Close button */}
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute right-4 top-4 p-1 border border-white rounded-full text-white hover:bg-white hover:text-black transition"
                >
                  ✕
                </button>

                {/* Banner image */}
                {popupInfo.backdrop_path && (
                  <img
                    src={`${imageUrl}${popupInfo.backdrop_path}`}
                    alt={popupInfo.title}
                    className="rounded-t-lg"
                  />
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 p-4 -mt-14">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      playMovie(popupInfo);
                    }}
                    className="flex items-center gap-2 bg-accent hover:bg-accentDark px-6 py-2 rounded text-white font-semibold transition"
                  >
                    ▶ Play
                  </button>

                  <button
                    onClick={() => addToLikedMovies(popupInfo)}
                    className="w-10 h-10 border rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition"
                  >
                    ❤
                  </button>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h2 className="text-3xl font-bold text-white">
                    {popupInfo.title || popupInfo.name}
                  </h2>

                  <p className="text-green-500 font-semibold mt-2">
                    {popupInfo.release_date || popupInfo.first_air_date}
                  </p>

                  <p className="text-neutral-300 mt-4 line-clamp-4">
                    {popupInfo.overview}
                  </p>

                  <div className="mt-6 space-y-2 text-sm text-neutral-400">
                    <div className="flex items-center">
                      Rating:
                      <div className="ml-2">
                        <StarRatings
                          rating={popupInfo.vote_average / 2}
                          starRatedColor="#facc15"
                          numberOfStars={5}
                          starDimension="1rem"
                          starSpacing="0.2rem"
                        />
                      </div>
                    </div>

                    <div>
                      Language:
                      <span className="text-white ml-2">
                        {popupInfo.original_language}
                      </span>
                    </div>

                    <div>
                      Genre:
                      {popupInfo.genre_ids &&
                        convertGenere(popupInfo.genre_ids).map((genre, i) => (
                          <span
                            key={i}
                            className="text-white ml-2 font-medium"
                          >
                            {genre}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="flex justify-end gap-4 mt-6">
                    {from === "MyList" && (
                      <button
                        onClick={() => removeFromMyList(popupInfo)}
                        className="border px-4 py-2 rounded text-white hover:bg-white hover:text-black transition"
                      >
                        Remove from My List
                      </button>
                    )}

                    <button
                      onClick={() => setShowModal(false)}
                      className="text-neutral-400 hover:text-white transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </Fade>
          </div>

          <div className="fixed inset-0 bg-black opacity-40 z-40"></div>
        </>
      )}
    </>
  );
}

export default MoviePopUp;
