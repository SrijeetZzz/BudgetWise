
import {
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useTheme } from "../../../providers/ThemeProvider";



interface CategoryBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onClosed?: () => void;
  children: ReactNode;
}

export default function CategoryBottomSheet({
  visible,
  onClose,
  onClosed,
  children,
}: CategoryBottomSheetProps) {
  const { theme } = useTheme();

  const translateY = useRef(
    new Animated.Value(1000),
  ).current;

  const [mounted, setMounted] =
    useState(visible);

  /*
   * =========================================================
   * OPEN / CLOSE ANIMATION
   * =========================================================
   */

  useEffect(() => {
    if (visible) {
      /*
       * Make sure Modal is mounted before
       * starting the opening animation.
       */

      setMounted(true);

      translateY.setValue(1000);

      requestAnimationFrame(() => {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,

          damping: 24,
          stiffness: 180,
          mass: 0.8,
        }).start();
      });

      return;
    }

    /*
     * =======================================================
     * CLOSE
     * =======================================================
     *
     * IMPORTANT:
     *
     * We do NOT immediately unmount the Modal.
     *
     * We first animate it down and only then
     * call onClosed().
     */

    if (!mounted) {
      return;
    }

    Animated.timing(translateY, {
      toValue: 1000,
      duration: 180,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) {
        return;
      }

      setMounted(false);

      onClosed?.();
    });
  }, [
    visible,
    mounted,
    translateY,
    onClosed,
  ]);

  /*
   * =========================================================
   * BACKDROP / HARDWARE BACK BUTTON
   * =========================================================
   */

  const handleClose = () => {
    /*
     * Tell parent that close was requested.
     *
     * Parent will change visible to false.
     *
     * The useEffect above will then perform
     * the closing animation.
     */

    onClose();
  };

  /*
   * =========================================================
   * MODAL
   * =========================================================
   */

  if (!mounted) {
    return null;
  }

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={styles.root}>
        {/* =================================================
            BACKDROP
        ================================================= */}

        <Pressable
          style={styles.backdrop}
          onPress={handleClose}
        />

        {/* =================================================
            BOTTOM SHEET
        ================================================= */}

        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor:
                theme.surface,
            },
            {
              transform: [
                {
                  translateY,
                },
              ],
            },
          ]}
        >
          <KeyboardAvoidingView
            behavior={
              Platform.OS === "ios"
                ? "padding"
                : undefined
            }
            style={
              styles.keyboardContainer
            }
          >
            {/* Drag Handle */}

            <View
              style={[
                styles.handle,
                {
                  backgroundColor:
                    theme.border,
                },
              ]}
            />

            {children}
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  /*
   * =========================================================
   * ROOT
   * =========================================================
   */

  root: {
    flex: 1,

    justifyContent: "flex-end",

    backgroundColor: "transparent",
  },

  /*
   * =========================================================
   * BACKDROP
   * =========================================================
   */

  backdrop: {
    ...StyleSheet.absoluteFill,

    backgroundColor:
      "rgba(0, 0, 0, 0.55)",
  },

  /*
   * =========================================================
   * SHEET
   * =========================================================
   */

  sheet: {
    width: "100%",

    maxHeight: "92%",

    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

    overflow: "hidden",

    shadowColor: "#000000",

    shadowOffset: {
      width: 0,
      height: -4,
    },

    shadowOpacity: 0.12,
    shadowRadius: 12,

    elevation: 12,
  },

  /*
   * =========================================================
   * KEYBOARD
   * =========================================================
   */

  keyboardContainer: {
    width: "100%",
  },

  /*
   * =========================================================
   * HANDLE
   * =========================================================
   */

  handle: {
    alignSelf: "center",

    width: 40,
    height: 4,

    marginTop: 10,
    marginBottom: 4,

    borderRadius: 3,
  },
});