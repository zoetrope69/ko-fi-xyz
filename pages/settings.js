import { useEffect, useState } from "react";
import Head from "next/head";

import Navigation from "../components/navigation";
import ColourContrastInfo from "../components/colour-contrast-info";
import Alert from "../components/alert";
import useAPI from "../hooks/useAPI";

async function updateOverlay(id, data) {
  await fetch("/api/overlays", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      data,
    }),
  });
}

export default function Dashboard() {
  const [isSaving, setIsSaving] = useState(false);
  const { data: user, isLoading: isLoadingUser } = useAPI("/user");
  const { data: overlay, isLoading: isLoadingOverlay } = useAPI(
    "/overlays/" + user?.overlayId
  );
  const [formData, setFormData] = useState({});
  const {
    canPlaySounds,
    messageText,
    messageDuration,
    messageBackgroundColor,
    messageTextColor,
    messagePosition,
  } = formData;

  useEffect(() => {
    if (!isLoadingOverlay && overlay) {
      setFormData(overlay);
    }
  }, [isLoadingOverlay, overlay]);

  const isLoading = isLoadingUser || isLoadingOverlay;

  const handleSave = async (event) => {
    event.preventDefault();

    if (user?.overlayId) {
      setIsSaving(true);
      await updateOverlay(user?.overlayId, formData);
      setIsSaving(false);
    }
  };

  const handleMessageTextChange = (event) => {
    event.preventDefault();

    const newMessageText = event.target.value;
    setFormData((previousFormData) => {
      return {
        ...previousFormData,
        messageText: newMessageText,
      };
    });
  };

  const handleMessageDurationChange = (event) => {
    event.preventDefault();
    const newMessageDuration = event.target.value;
    setFormData((previousFormData) => {
      return {
        ...previousFormData,
        messageDuration: newMessageDuration,
      };
    });
  };

  const handleCanPlaySoundsChange = (event) => {
    event.preventDefault();
    const newCanPlaySounds = event.target.value === "play";
    setFormData((previousFormData) => {
      return {
        ...previousFormData,
        canPlaySounds: newCanPlaySounds,
      };
    });
  };

  const handleMessageBackgroundColorChange = (event) => {
    event.preventDefault();
    const newMessageBackgroundColor = event.target.value;
    setFormData((previousFormData) => {
      return {
        ...previousFormData,
        messageBackgroundColor: newMessageBackgroundColor,
      };
    });
  };

  const handleMessageTextColorChange = (event) => {
    event.preventDefault();
    const newMessageTextColor = event.target.value;
    setFormData((previousFormData) => {
      return {
        ...previousFormData,
        messageTextColor: newMessageTextColor,
      };
    });
  };

  const handleMessagePositionChange = (event) => {
    event.preventDefault();
    const newMessagePosition = event.target.value;
    setFormData((previousFormData) => {
      return {
        ...previousFormData,
        messagePosition: newMessagePosition,
      };
    });
  };

  if (!isLoading && !user?.email) {
    return (
      <div className="wrapper">
        <Head>
          <title>Ko-fi Custom Alerts - Settings</title>
        </Head>

        <Navigation user={user} isLoading={isLoading} />

        <main>
          <h1>Ko-fi Custom Alerts - Settings</h1>

          <p>Something went wrong. Try logging out...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <Head>
        <title>Ko-fi Custom Alerts - Settings</title>
      </Head>

      <Navigation user={user} isLoading={isLoading} />

      <main>
        <h2>Settings</h2>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            {user && (
              <>
                <form onSubmit={handleSave}>
                  <div>
                    <label htmlFor="can-play-sounds">
                      Play Sound
                    </label>
                    <span className="Hint">
                      Play a sound when there is a notificaiton
                    </span>
                    <select
                      id="can-play-sounds"
                      name="can-play-sounds"
                      onChange={handleCanPlaySoundsChange}
                      value={canPlaySounds ? "play" : "no-play"}
                      disabled={isSaving}
                    >
                      <option value="no-play">🔇 No sounds</option>
                      <option value="play">
                        🔊 Will play sounds
                      </option>
                      );
                    </select>
                  </div>

                  <fieldset>
                    <legend>Message</legend>

                    <div>
                      <label htmlFor="message-text">Text</label>
                      <span className="Hint">
                        The text that appears when someone supports
                        you.
                      </span>
                      <span className="Hint">
                        You can use placeholders {"{from_name}"},{" "}
                        {"{message}"}, {"{amount}"}.
                      </span>
                      <textarea
                        id="message-text"
                        name="message-text"
                        placeholder="{amount} from {from_name} - {message}"
                        value={
                          messageText ||
                          "{amount} from {from_name} - {message}"
                        }
                        onChange={handleMessageTextChange}
                        disabled={isSaving}
                      />
                    </div>

                    <div>
                      <label htmlFor="message-duration">
                        Duration
                      </label>
                      <span className="Hint">
                        How long should the message stay on the
                        screen?
                      </span>
                      <select
                        id="message-duration"
                        name="message-duration"
                        onChange={handleMessageDurationChange}
                        value={messageDuration || "5"}
                        disabled={isSaving}
                      >
                        {["5", "10", "15", "20"].map((value) => {
                          return (
                            <option
                              key={`message-duration-${value}`}
                              value={value}
                            >
                              {value} seconds
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend>Colours</legend>
                    <div>
                      <label htmlFor="message-background-color">
                        Background
                      </label>
                      <span className="Hint">
                        Colour for background of alert
                      </span>
                      <input
                        id="message-background-color"
                        name="message-background-color"
                        type="color"
                        value={messageBackgroundColor || "#000000"}
                        onChange={handleMessageBackgroundColorChange}
                        disabled={isSaving}
                      />
                    </div>
                    <div>
                      <label htmlFor="message-text-color">Text</label>
                      <span className="Hint">
                        Colour for text of alert
                      </span>
                      <input
                        id="message-text-color"
                        name="message-text-color"
                        type="color"
                        value={messageTextColor || "#FFFFFF"}
                        onChange={handleMessageTextColorChange}
                        disabled={isSaving}
                      />
                    </div>

                    <ColourContrastInfo
                      firstColor={messageBackgroundColor}
                      secondColor={messageTextColor}
                    />
                  </fieldset>

                  <div>
                    <label htmlFor="message-duration">Position</label>
                    <span className="Hint">
                      Where should it be placed?
                    </span>
                    <select
                      id="message-position"
                      name="message-position"
                      onChange={handleMessagePositionChange}
                      value={messagePosition || "top-left"}
                      disabled={isSaving}
                    >
                      <option value="top-left">Top left</option>
                      <option value="top-right">Top right</option>
                      <option value="bottom-left">Bottom left</option>
                      <option value="bottom-right">
                        Bottom right
                      </option>
                    </select>
                  </div>

                  <button
                    className="Button"
                    type="submit"
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                </form>
              </>
            )}
          </>
        )}
      </main>

      {!isLoading && (
        <aside>
          <h3>Preview</h3>

          <div className="PreviewContainer PreviewContainer--big">
            <div className="Preview">
              <Alert
                currentAlert={{
                  data: {
                    amount: 3.0,
                    currency: "GBP",
                    from_name: "Mr Blobby",
                    message: "Hello there",
                  },
                }}
                overlay={{
                  ...formData,
                  // disable sounds in preview
                  canPlaySounds: false,
                }}
                isRemoving={false}
              />
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
