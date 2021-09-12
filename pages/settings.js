import { useEffect, useState } from "react";
import Head from "next/head";

import Navigation from "../components/navigation";
import ColourContrastInfo from "../components/colour-contrast-info";
import Alert from "../components/alert";
import useAPI from "../hooks/useAPI";
import useGetSession from "../hooks/useGetSession";
import { supabase } from "../helpers/supabase-clientside";

export default function Settings() {
  const [isFormUnsaved, setIsFormUnsaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { data: user, isLoading: isLoadingUser } =
    useAPI("/api/user");
  const {
    data: overlay,
    isLoading: isLoadingOverlay,
    mutate: mutateOverlay,
  } = useAPI(
    user?.overlay_id ? "/api/overlays/" + user?.overlay_id : null
  );
  const session = useGetSession();

  const [formData, setFormData] = useState({});
  const {
    canPlaySounds,
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

  const handleMessageTextChange = (event) => {
    event.preventDefault();
    updateFormDataProperty("messageText", event);
  };

  const handleMessageDurationChange = (event) => {
    event.preventDefault();
    updateFormDataProperty("messageDuration", event);
  };

  const handleCanPlaySoundsChange = (event) => {
    event.preventDefault();
    updateFormDataProperty("canPlaySounds", event, "play");
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
        <title>
          {isFormUnsaved ? "* " : ""}Ko-fi Custom Alerts - Settings
        </title>
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
                <form>
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
                        {"{message}"}, {"{amount}"}, {"{type}"}.
                      </span>
                      <textarea
                        id="message-text"
                        name="message-text"
                        placeholder="{type} of {amount} from {from_name} - {message}"
                        value={messageText}
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
                      >
                        <option value="slide">Slide in/out</option>
                        <option value="fade">Fade in/out</option>
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

                  <button
                    className="Button"
                    type="submit"
                    disabled={isSaving}
                    onClick={handleSave}
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
            </div>
          </div>

          <button
            className="Button Button--small"
            type="button"
            disabled={isSaving}
            onClick={handleSave}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>

          {isFormUnsaved && (
            <small> * New changes not saved...</small>
          )}

          <div>
            <button
              type="button"
              className="Button Button--secondary Button--small"
              onClick={handleTestDonationButtonClick}
            >
              Send test donation notification
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const { user: authorisedUser } =
    await supabase.auth.api.getUserByCookie(req);

  if (!authorisedUser) {
    // If no user, redirect to index.
    return {
      props: {},
      redirect: { destination: "/login", permanent: false },
    };
  }

  // If there is a user, return it.
  return { props: { authorisedUser } };
}
