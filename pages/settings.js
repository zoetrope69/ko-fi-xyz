import { useEffect, useState } from "react";
import Head from "next/head";

import { useUser } from "../components/UserProvider/UserProvider.js";
import Navigation from "../components/Navigation/Navigation.js";
import ColourContrastInfo from "../components/ColourContrastInfo/ColourContrastInfo.js";
import Alert from "../components/Alert/Alert.js";
import Preview from "../components/Preview/Preview.js";
import Button from "../components/Button/Button.js";
import useAPI from "../hooks/useAPI.js";

import {
  updateCustomSounds,
  SettingsCustomSound,
} from "../components/SettingsCustomSound/SettingsCustomSound.js";
import { redirectAuthedPages } from "../helpers/redirect-auth-pages.js";
import logger from "../helpers/logger.js";

export default function Settings() {
  const [isFormUnsaved, setIsFormUnsaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { session, user, isLoading: isLoadingUser } = useUser();
  const {
    data: overlay,
    isLoading: isLoadingOverlay,
    mutate: mutateOverlay,
  } = useAPI(
    user?.overlay_id ? "/api/overlays/" + user?.overlay_id : null
  );

  const [customSoundFileToUpload, setCustomSoundFileToUpload] =
    useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({});
  const {
    canPlaySounds,
    customSoundUrl,
    usesTextToSpeech,
    messageText,
    messageDuration,
    messageBackgroundColor,
    messageTextColor,
    messagePosition,
    messageSpacingHorizontal,
    messageSpacingVertical,
    messageAnimationType,
    messageAnimationDirection,
    messageShowIcon,
    messageHasCurvedCorners,
  } = formData;

  const isLoading = isLoadingUser || isLoadingOverlay;

  async function updateOverlaySettings(id, settings) {
    await fetch("/api/overlays", {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      }),
      credentials: "same-origin",
      body: JSON.stringify({
        id,
        settings,
      }),
    });
  }

  function haveChangesBeenMade(overlay, formData) {
    let haveChangesBeenMade = false;

    Object.keys(formData).forEach((key) => {
      if (haveChangesBeenMade) {
        return;
      }

      // new data added that isn't in database overlay
      if (!Object.prototype.hasOwnProperty.call(overlay, key)) {
        haveChangesBeenMade = true;
        return;
      }

      haveChangesBeenMade = overlay[key] !== formData[key];
    });

    setIsFormUnsaved(haveChangesBeenMade);
  }

  useEffect(() => {
    if (!isLoadingOverlay && overlay) {
      setFormData(overlay.settings);
    }
  }, [isLoadingOverlay, overlay]);

  useEffect(() => {
    if (!isLoadingOverlay && overlay) {
      haveChangesBeenMade(overlay.settings, formData);
    }
  }, [isLoadingOverlay, overlay, formData]);

  const handleSave = async (event) => {
    event.preventDefault();

    if (user?.overlay_id) {
      setIsSaving(true);
      try {
        await updateCustomSounds({
          customSoundUrl,
          customSoundFileToUpload,
          setCustomSoundFileToUpload,
          user,
        });
      } catch (e) {
        logger.error(e.message);

        setIsSaving(false);
        return;
      }
      await updateOverlaySettings(user?.overlay_id, formData);
      setIsSaving(false);
      setIsFormUnsaved(false);
      mutateOverlay({ ...overlay, settings: formData });
    }
  };

  function updateFormDataProperty(property, event, check) {
    let newValue;
    if (check) {
      newValue = event.target.value === check;
    } else {
      newValue = event.target.value;
    }

    setFormData((previousFormData) => {
      return {
        ...previousFormData,
        [property]: newValue,
      };
    });
  }

  const handleCanPlaySoundsChange = (event) => {
    event.preventDefault();
    updateFormDataProperty("canPlaySounds", event, "play");
  };

  const handleCustomSoundChange = (newCustomSoundUrl, file) => {
    setCustomSoundFileToUpload(file);
    setFormData((previousFormData) => {
      return {
        ...previousFormData,
        customSoundUrl: newCustomSoundUrl,
      };
    });
  };

  const handleUsesTextToSpeechChange = (event) => {
    event.preventDefault();
    updateFormDataProperty("usesTextToSpeech", event, "play");
  };

  const handleMessageTextChange = (event) => {
    event.preventDefault();
    updateFormDataProperty("messageText", event);
  };

  const handleMessageDurationChange = (event) => {
    event.preventDefault();
    updateFormDataProperty("messageDuration", event);
  };

  const handleMessageBackgroundColorChange = (event) => {
    event.preventDefault();
    updateFormDataProperty("messageBackgroundColor", event);
  };

  const handleMessageTextColorChange = (event) => {
    event.preventDefault();
    updateFormDataProperty("messageTextColor", event);
  };

  const handleMessagePositionChange = (event) => {
    event.preventDefault();
    updateFormDataProperty("messagePosition", event);
  };

  const handleMessageSpacingHorizontal = (event) => {
    event.preventDefault();
    updateFormDataProperty("messageSpacingHorizontal", event);
  };

  const handleMessageSpacingVertical = (event) => {
    event.preventDefault();
    updateFormDataProperty("messageSpacingVertical", event);
  };

  const handleMessageAnimationType = (event) => {
    event.preventDefault();
    updateFormDataProperty("messageAnimationType", event);
  };

  const handleMessageAnimationDirection = (event) => {
    event.preventDefault();
    updateFormDataProperty("messageAnimationDirection", event);
  };

  const handleMessageShowIcon = (event) => {
    event.preventDefault();
    updateFormDataProperty("messageShowIcon", event, "show");
  };

  const handleMessageHasCurvedCorners = (event) => {
    event.preventDefault();
    updateFormDataProperty("messageHasCurvedCorners", event, "round");
  };

  const handleTestDonationButtonClick = async (event) => {
    event.preventDefault();

    if (!user?.webhook_id) {
      return;
    }

    // https://ko-fi.com/manage/webhooks
    await fetch("/api/webhook/" + user.webhook_id, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      }),
      credentials: "same-origin",
      body: JSON.stringify({
        data: JSON.stringify({
          message_id: "05be1c80-96cd-4fb9-afa7-1f3883a6493e",
          timestamp: "2021-09-08T16:20:47.8293325Z",
          type: "Donation",
          is_public: true,
          from_name: "zactopus",
          message: "is it working?",
          amount: "3.00",
          url: "https://ko-fi.com/path-to-details",
          currency: "GBP",
          is_subscription_payment: false,
          is_first_subscription_payment: false,
          kofi_transaction_id: "1234-1234-1234-1234",
        }),
      }),
    });
  };

  if (!isLoading && !user?.id) {
    return (
      <div className="wrapper">
        <Head>
          <title>Ko-fi XYZ - Settings</title>
        </Head>

        <Navigation />

        <main>
          <h1>Ko-fi XYZ - Settings</h1>

          <p>Something went wrong. Try logging out...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <Head>
        <title>{isFormUnsaved ? "* " : ""}Ko-fi XYZ - Settings</title>
      </Head>

      <Navigation />

      <main>
        <h2>Settings</h2>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            {user && (
              <>
                {errorMessage && (
                  <p className="ErrorMessage">{errorMessage}</p>
                )}

                <form>
                  <fieldset>
                    <legend>Sounds</legend>

                    <div>
                      <label htmlFor="can-play-sounds">
                        Play Sound
                      </label>
                      <span className="Hint">
                        Play a sound when there is a notification
                      </span>
                      <select
                        id="can-play-sounds"
                        name="can-play-sounds"
                        onChange={handleCanPlaySoundsChange}
                        value={canPlaySounds ? "play" : "no-play"}
                        disabled={isSaving}
                      >
                        <option value="no-play">No sounds</option>
                        <option value="play">Will play sounds</option>
                      </select>
                    </div>

                    <SettingsCustomSound
                      userId={user?.id}
                      customSoundUrl={customSoundUrl}
                      handleCustomSoundChange={
                        handleCustomSoundChange
                      }
                      customSoundFileToUpload={
                        customSoundFileToUpload
                      }
                      setErrorMessage={setErrorMessage}
                    />

                    <div>
                      <label htmlFor="uses-text-to-speech">
                        Text-to-speech
                      </label>
                      <span className="Hint">
                        Have lovely Brian read message out with
                        text-to-speech
                      </span>
                      <select
                        id="uses-text-to-speech"
                        name="uses-text-to-speech"
                        onChange={handleUsesTextToSpeechChange}
                        value={usesTextToSpeech ? "play" : "no-play"}
                        disabled={isSaving}
                      >
                        <option value="no-play">
                          No text-to-speech
                        </option>
                        <option value="play">Text-to-speech</option>
                      </select>
                    </div>
                  </fieldset>

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
                        {"{message}"}, {"{amount}"}, {"{type}"}.
                      </span>
                      <textarea
                        id="message-text"
                        name="message-text"
                        placeholder="{type} of {amount} from {from_name} {message}"
                        value={messageText}
                        onChange={handleMessageTextChange}
                        disabled={isSaving}
                        required={true}
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
                        required={true}
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

                  <fieldset>
                    <legend>Position/spacing</legend>

                    <div>
                      <label htmlFor="message-position">
                        Position
                      </label>
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
                        <option value="bottom-left">
                          Bottom left
                        </option>
                        <option value="bottom-right">
                          Bottom right
                        </option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message-spacing-horizontal">
                        {messagePosition
                          ? messagePosition.includes("left")
                            ? "Left"
                            : "Right"
                          : "Side"}{" "}
                        Spacing
                      </label>
                      <input
                        id="message-spacing-horizontal"
                        name="message-spacing-horizontal"
                        type="number"
                        value={messageSpacingHorizontal || "50"}
                        onChange={handleMessageSpacingHorizontal}
                        disabled={isSaving}
                      />
                    </div>

                    <div>
                      <label htmlFor="message-spacing-vertical">
                        {messagePosition
                          ? messagePosition.includes("top")
                            ? "Top"
                            : "Bottom"
                          : "Top/Bottom"}{" "}
                        Spacing
                      </label>
                      <input
                        id="message-spacing-vertical"
                        name="message-spacing-vertical"
                        type="number"
                        value={messageSpacingVertical || "50"}
                        onChange={handleMessageSpacingVertical}
                        disabled={isSaving}
                        required={true}
                      />
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend>Animation</legend>

                    <div>
                      <label htmlFor="message-animation-type">
                        Type
                      </label>
                      <span className="Hint">
                        Where should it be placed?
                      </span>
                      <select
                        id="message-animation-type"
                        name="message-animation-type"
                        onChange={handleMessageAnimationType}
                        value={messageAnimationType || "slide"}
                        disabled={isSaving}
                        required={true}
                      >
                        <option value="slide">Slide in/out</option>
                        <option value="fade">Fade in/out</option>
                        <option value="swipe">
                          Swipe in/out (Slide with no fade)
                        </option>
                      </select>
                    </div>

                    {messageAnimationType !== "fade" && (
                      <div>
                        <label htmlFor="message-animation-direction">
                          Direction
                        </label>
                        <span className="Hint">
                          Where it animates in from
                        </span>
                        <select
                          id="message-animation-direction"
                          name="message-animation-direction"
                          onChange={
                            handleMessageAnimationDirection || "top"
                          }
                          value={messageAnimationDirection}
                          disabled={isSaving}
                        >
                          <option value="top">From the top</option>
                          <option value="right">
                            From the right
                          </option>
                          <option value="bottom">
                            From the bottom
                          </option>
                          <option value="left">From the left</option>
                        </select>
                      </div>
                    )}
                  </fieldset>

                  <fieldset>
                    <legend>Visuals</legend>

                    <div>
                      <label htmlFor="message-show-icon">
                        Show Ko-fi Icon
                      </label>
                      <select
                        id="message-show-icon"
                        name="message-show-icon"
                        onChange={handleMessageShowIcon}
                        value={messageShowIcon ? "show" : "hide"}
                        disabled={isSaving}
                      >
                        <option value="hide">Hide</option>
                        <option value="show">Show</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message-corners">Corners</label>
                      <select
                        id="message-corners"
                        name="message-corners"
                        onChange={handleMessageHasCurvedCorners}
                        value={
                          messageHasCurvedCorners ? "round" : "square"
                        }
                        disabled={isSaving}
                      >
                        <option value="round">Round</option>
                        <option value="square">Square</option>
                      </select>
                    </div>
                  </fieldset>

                  <Button
                    type="submit"
                    disabled={isSaving}
                    onClick={handleSave}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </form>
              </>
            )}
          </>
        )}
      </main>

      {!isLoading && (
        <aside>
          <h3>Preview</h3>

          <Preview isBig>
            <Alert
              currentAlert={{
                kofi_data: {
                  amount: 3.0,
                  currency: "GBP",
                  from_name: "Mr Blobby",
                  message: "Hello there",
                  type: "Donation",
                },
              }}
              settings={{
                ...formData,
                // disable sounds in preview
                canPlaySounds: false,
              }}
              isRemoving={false}
            />
          </Preview>

          <Button
            isSmall
            type="button"
            disabled={isSaving}
            onClick={handleSave}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>

          {isFormUnsaved && (
            <small> * New changes not saved...</small>
          )}

          <div>
            <Button
              isSmall
              isSecondary
              type="button"
              onClick={handleTestDonationButtonClick}
            >
              Send test donation notification
            </Button>
          </div>
        </aside>
      )}
    </div>
  );
}

export async function getServerSideProps({ req }) {
  return redirectAuthedPages(req);
}
