# Purpose: To represent text
# Author: Alex Wong

import pygame

from Drawable import Drawable


class Text(Drawable):
    # Constructor
    def __init__(self, x, y, text, visible):
        super().__init__(x, y, visible)
        self.__text = text
        self.__surface = None

    # Getters
    def get_text(self):
        return self.__text

    # The get rect method gets the size of a rectangle that tightly squeezes the object.
    def get_rect(self, surface):
        return self.__surface.get_rect()

    # Setters
    def set_text(self, text):
        self.__text = text

    # The draw method creates the text in the upper left corner.
    def draw(self, surface):
        fontObj = pygame.font.Font("freesansbold.ttf", 20)
        self.__surface = fontObj.render(self.get_text(), True, (0, 0, 0))
        surface.blit(self.__surface, self.get_location())
