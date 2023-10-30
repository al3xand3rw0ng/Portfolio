# Purpose: To represent a drawable object
# Author: Alex Wong

from abc import ABC, abstractmethod


class Drawable(ABC):
    # Constructor
    def __init__(self, x, y, visible):
        self.__x = x
        self.__y = y
        # Should this drawable object be drawn?
        self.__visible = visible

    # Getters
    def get_location(self):
        return self.__x, self.__y

    def get_visible(self):
        return self.__visible

    # Returns the size of a rectangle that tightly squeezes the object
    @abstractmethod
    def get_rect(self, surface):
        pass

    # Setters
    def set_location(self, point):
        self.__x = point[0]
        self.__y = point[1]

    def set_visible(self, visible):
        self.__visible = visible

    # Draw this drawable object
    @abstractmethod
    def draw(self, surface):
        pass
