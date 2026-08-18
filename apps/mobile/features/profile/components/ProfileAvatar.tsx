import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Camera,
  Pencil,
  Trash2,
  User,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

import type {
  Profile,
  ProfileImageFile,
} from "../../../types/profile.types";

import { useProfileImage } from "../hooks/use-profile-image";

interface ProfileAvatarProps {
  profile: Profile;
}

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  "";

function getImageUrl(
  profileImage: string | null,
) {
  if (!profileImage) {
    return null;
  }

  return `${API_BASE_URL.replace(
    "/api/v1",
    "",
  )}/${profileImage}`;
}

export default function ProfileAvatar({
  profile,
}: ProfileAvatarProps) {
  const { upload, remove } =
    useProfileImage();

  const imageUrl = getImageUrl(
    profile.profileImage,
  );

  const isProcessing =
    upload.isPending ||
    remove.isPending;

  const handlePickImage = async () => {
    if (isProcessing) {
      return;
    }

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "BudgetWise needs access to your photos to update your profile picture.",
      );

      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync(
        {
          mediaTypes: [
            "images",
          ],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.85,
        },
      );

    if (
      result.canceled ||
      !result.assets?.length
    ) {
      return;
    }

    const asset = result.assets[0];

    const file: ProfileImageFile = {
      uri: asset.uri,

      name:
        asset.fileName ??
        `profile-${Date.now()}.jpg`,

      type:
        asset.mimeType ??
        "image/jpeg",
    };

    upload.mutate(file);
  };

  const handleRemoveImage = () => {
    if (isProcessing) {
      return;
    }

    Alert.alert(
      "Remove profile picture",
      "Are you sure you want to remove your profile picture?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () =>
            remove.mutate(),
        },
      ],
    );
  };

  const firstLetter =
    profile.displayName
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || "?";

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        {imageUrl ? (
          <Image
            source={{
              uri: imageUrl,
            }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.placeholder}>
            {profile.displayName ? (
              <Text style={styles.initial}>
                {firstLetter}
              </Text>
            ) : (
              <User
                size={34}
                color="#111111"
              />
            )}
          </View>
        )}

        {isProcessing && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
          </View>
        )}
      </View>

      {/* Edit */}
      <Pressable
        onPress={handlePickImage}
        disabled={isProcessing}
        style={({ pressed }) => [
          styles.actionButton,
          styles.editButton,
          pressed &&
            styles.pressed,
          isProcessing &&
            styles.disabled,
        ]}
      >
        <Pencil
          size={15}
          color="#FFFFFF"
          strokeWidth={2.4}
        />
      </Pressable>

      {/* Delete */}
      {profile.profileImage && (
        <Pressable
          onPress={handleRemoveImage}
          disabled={isProcessing}
          style={({ pressed }) => [
            styles.actionButton,
            styles.deleteButton,
            pressed &&
              styles.pressed,
            isProcessing &&
              styles.disabled,
          ]}
        >
          <Trash2
            size={15}
            color="#FFFFFF"
            strokeWidth={2.4}
          />
        </Pressable>
      )}

      {/* Small camera indicator */}
      {!profile.profileImage &&
        !isProcessing && (
          <View style={styles.cameraBadge}>
            <Camera
              size={13}
              color="#FFFFFF"
            />
          </View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 88,
    height: 88,

    position: "relative",

    alignItems: "center",
    justifyContent: "center",
  },

  avatarWrapper: {
    width: 80,
    height: 80,

    borderRadius: 40,

    overflow: "hidden",

    backgroundColor: "#F5F5F5",

    borderWidth: 2,
    borderColor: "#E5E5E5",
  },

  avatar: {
    width: "100%",
    height: "100%",
  },

  placeholder: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#F4F4F4",
  },

  initial: {
    fontSize: 30,
    fontWeight: "800",

    color: "#111111",
  },

  loadingOverlay: {
    position: "absolute",

    inset: 0,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "rgba(0,0,0,0.55)",
  },

  actionButton: {
    position: "absolute",

    width: 30,
    height: 30,

    borderRadius: 15,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  editButton: {
    right: -2,
    bottom: 3,

    backgroundColor: "#111111",
  },

  deleteButton: {
    right: -2,
    top: 2,

    backgroundColor: "#DC2626",
  },

  cameraBadge: {
    position: "absolute",

    left: -1,
    bottom: 3,

    width: 25,
    height: 25,

    borderRadius: 13,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#111111",

    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  pressed: {
    opacity: 0.7,
    transform: [
      {
        scale: 0.94,
      },
    ],
  },

  disabled: {
    opacity: 0.5,
  },
});