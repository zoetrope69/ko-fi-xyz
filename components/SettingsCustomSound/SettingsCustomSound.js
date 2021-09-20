import { useEffect, useState } from "react";

import logger from "../../helpers/logger";
import { supabase } from "../../helpers/supabase-clientside";

import Button from "../Button/Button";

const BYTES_500_K = 500 * 1000;

const INITIAL_TEMPORARY_SOUND_FILE = {
  value: "",
  file: null,
  publicURL: null,
};

const VALID_MIME_TYPES = {
  "audio/mpeg": "mp3",
  "audio/wav": "wav",
  "audio/vnd.wav": "wav",
  "audio/x-ms-wma": "wma",
  "audio/ogg": "ogg",
  "video/ogg": "ogg",
};

async function uploadCustomSounds({
  customSoundUrl,
  customSoundFileToUpload,
}) {
  const { data, error } = await supabase.storage
    .from("sounds")
    .upload(customSoundUrl, customSoundFileToUpload, {
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Sound didn't upload correctly");
  }
}

async function getCustomSounds({ user }) {
  const { data, error } = await supabase.storage
    .from("sounds")
    .list(user?.id);

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return [];
  }

  return data;
}

async function deleteExtraCustomSounds({
  customSounds,
  customSoundUrl,
  user,
}) {
  const filesToDelete = customSounds
    .map((sound) => {
      return `${user?.id}/${sound.name}`;
    })
    .filter((soundUrl) => {
      if (!customSoundUrl) {
        return true;
      }

      return soundUrl !== customSoundUrl;
    });

  if (filesToDelete.length === 0) {
    return;
  }

  const { error } = await supabase.storage
    .from("sounds")
    .remove(filesToDelete);

  if (error) {
    throw new Error(error.message);
  }

  return;
}

export async function updateCustomSounds({
  customSoundUrl,
  customSoundFileToUpload,
  setCustomSoundFileToUpload,
  user,
}) {
  if (customSoundFileToUpload && customSoundUrl) {
    await uploadCustomSounds({
      customSoundUrl,
      customSoundFileToUpload,
    });
  }

  const customSounds = await getCustomSounds({ user });

  await deleteExtraCustomSounds({
    customSounds,
    customSoundUrl,
    user,
  });

  setCustomSoundFileToUpload(null);

  return;
}

export const SettingsCustomSound = ({
  userId,
  customSoundUrl,
  customSoundFileToUpload,
  handleCustomSoundChange,
  setErrorMessage,
}) => {
  const [temporarySound, setTemporarySound] = useState(
    INITIAL_TEMPORARY_SOUND_FILE
  );

  useEffect(() => {
    if (customSoundUrl && !customSoundFileToUpload) {
      const { publicURL, error } = supabase.storage
        .from("sounds")
        .getPublicUrl(customSoundUrl);

      if (error) {
        logger.error(error.message);
        return;
      }

      setTemporarySound({
        ...INITIAL_TEMPORARY_SOUND_FILE,
        publicURL,
      });
    }
  }, [customSoundUrl, customSoundFileToUpload, setTemporarySound]);

  const isValidFile = (event) => {
    const fileDoesntExist = event.target.files.length !== 1;
    if (fileDoesntExist) {
      setErrorMessage("No file uploaded...");
      return false;
    }

    const [file] = event.target.files;

    const isInvalidMIMEType = !Object.prototype.hasOwnProperty.call(
      VALID_MIME_TYPES,
      file.type
    );
    if (isInvalidMIMEType) {
      setErrorMessage(
        `Incorrect file type {${file.type}}. We accept .mp3, .wav, .wma, or .ogg files`
      );
      return false;
    }

    const isTooBig = file.size >= BYTES_500_K;
    if (isTooBig) {
      setErrorMessage(
        "File is bigger than 1MB. Try optimising it..."
      );
      return false;
    }

    return true;
  };

  const uploadFile = async (file) => {
    if (!file || !userId) {
      logger.error({ file, userId });
      throw new Error("Missing file or userId");
    }

    const dateNow = new Date().toJSON().replace(":", "-");
    const fileType = VALID_MIME_TYPES[file.type];
    const fileName = `${userId}/sound-${dateNow}.${fileType}`;

    handleCustomSoundChange(fileName, file);
  };

  const handleCustomSoundFileUpload = async (event) => {
    event.preventDefault();

    const { value, files } = event.target;

    if (!isValidFile(event)) {
      return;
    }

    const [file] = files;

    setTemporarySound({ value, file });

    try {
      await uploadFile(file);

      // wipe error message if successful
      setErrorMessage("");

      // set the public url to the overlay settings
    } catch (e) {
      logger.error(e.message || e);
      setErrorMessage("Something went wrong uploading the sound...");
      return;
    }
  };

  const handleCustomButtonDefaultClick = (event) => {
    event.preventDefault();

    // wipe error message
    setErrorMessage("");
    setTemporarySound(INITIAL_TEMPORARY_SOUND_FILE);

    // remove custom file
    handleCustomSoundChange(null);
  };

  const getAudioSource = () => {
    if (temporarySound.publicURL) {
      return temporarySound.publicURL;
    }

    if (temporarySound.file) {
      return URL.createObjectURL(temporarySound.file);
    }

    return "/jingle.wav";
  };

  const audioSource = getAudioSource();

  return (
    <div>
      <label htmlFor="custom-sound">Custom Sound</label>
      <span className="Hint">
        Replace the default alert sound with this audio. Accepts .mp3,
        .wav, .wma, or .ogg files less than 1MB.
        <audio src={audioSource} controls preload="auto" />
      </span>
      {!customSoundUrl ? (
        <input
          id="custom-sound"
          type="file"
          accept="audio/*"
          onChange={handleCustomSoundFileUpload}
          value={temporarySound.value}
        />
      ) : (
        <Button
          isSmall
          isSecondary
          onClick={handleCustomButtonDefaultClick}
        >
          Remove custom sound
        </Button>
      )}
    </div>
  );
};
